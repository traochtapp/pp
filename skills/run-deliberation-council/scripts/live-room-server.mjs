#!/usr/bin/env node

import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const host = '127.0.0.1';
const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const requestedPort = Number(portIndex >= 0 ? args[portIndex + 1] : process.env.LIVE_ROOM_PORT || 4321);
const basePort = Number.isInteger(requestedPort) && requestedPort >= 0 ? requestedPort : 4321;
const here = dirname(fileURLToPath(import.meta.url));
const pagePath = join(here, '..', 'assets', 'live-room.html');
const clients = new Set();

let room = {
  topic: '等待新议题',
  status: '准备中',
  roles: [],
  turns: []
};

const sendEvent = (response, event, value) => {
  response.write(`event: ${event}\n`);
  response.write(`data: ${JSON.stringify(value)}\n\n`);
};

const broadcast = (event, value) => {
  for (const client of clients) sendEvent(client, event, value);
};

const publicTurn = (value) => {
  if (!value || typeof value.speaker !== 'string' || typeof value.message !== 'string') {
    throw new Error('A public turn requires speaker and message strings.');
  }
  return {
    kind: String(value.kind || 'host'),
    avatar: String(value.avatar || '·'),
    speaker: value.speaker,
    action: String(value.action || '发言'),
    reply: String(value.reply || ''),
    message: value.message,
    sequence: room.turns.length + 1
  };
};

const applyCommand = (command) => {
  if (!command || typeof command.type !== 'string') throw new Error('Command type is required.');

  if (command.type === 'reset') {
    room = {
      topic: String(command.topic || '未命名议题'),
      status: String(command.status || '独立锚点建立中'),
      roles: Array.isArray(command.roles) ? command.roles.map(String) : [],
      turns: []
    };
    broadcast('snapshot', room);
    return { ok: true, type: 'reset', count: 0 };
  }

  if (command.type === 'turn') {
    const turn = publicTurn(command);
    room.turns.push(turn);
    room.status = String(command.status || '讨论进行中');
    broadcast('turn', { turn, status: room.status });
    return { ok: true, type: 'turn', count: room.turns.length, sequence: turn.sequence };
  }

  if (command.type === 'status') {
    room.status = String(command.status || room.status);
    broadcast('status', { status: room.status });
    return { ok: true, type: 'status', status: room.status };
  }

  if (command.type === 'snapshot') {
    return { ok: true, type: 'snapshot', room };
  }

  if (command.type === 'stop') {
    return { ok: true, type: 'stop' };
  }

  throw new Error(`Unknown command type: ${command.type}`);
};

const readJson = async (request) => {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 1_000_000) throw new Error('Request body is too large.');
    chunks.push(chunk);
  }
  return chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {};
};

const respondJson = (response, status, value) => {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff'
  });
  response.end(JSON.stringify(value));
};

const server = createServer(async (request, response) => {
  const address = server.address();
  const activePort = typeof address === 'object' && address ? address.port : basePort;
  const url = new URL(request.url || '/', `http://${host}:${activePort}`);

  try {
    if (request.method === 'GET' && url.pathname === '/') {
      const page = await readFile(pagePath);
      response.writeHead(200, {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'no-store',
        'content-security-policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self'; img-src 'self' data:; base-uri 'none'; frame-ancestors 'self'",
        'x-content-type-options': 'nosniff'
      });
      response.end(page);
      return;
    }

    if (request.method === 'GET' && url.pathname === '/events') {
      response.writeHead(200, {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-cache, no-transform',
        connection: 'keep-alive',
        'x-content-type-options': 'nosniff'
      });
      response.write(': connected\n\n');
      clients.add(response);
      sendEvent(response, 'snapshot', room);
      request.on('close', () => clients.delete(response));
      return;
    }

    if (request.method === 'GET' && url.pathname === '/api/state') {
      respondJson(response, 200, room);
      return;
    }

    if (request.method === 'POST' && ['/api/reset', '/api/turn', '/api/status'].includes(url.pathname)) {
      const body = await readJson(request);
      const type = url.pathname.slice('/api/'.length);
      respondJson(response, 200, applyCommand({ ...body, type }));
      return;
    }

    respondJson(response, 404, { ok: false, error: 'not found' });
  } catch (error) {
    respondJson(response, 500, {
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
});

let shuttingDown = false;
const shutdown = () => {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const client of clients) client.end();
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 1000).unref();
};

const input = createInterface({ input: process.stdin, crlfDelay: Infinity, terminal: false });
input.on('line', (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  try {
    const command = JSON.parse(trimmed);
    const result = applyCommand(command);
    process.stdout.write(`${JSON.stringify(result)}\n`);
    if (command.type === 'stop') shutdown();
  } catch (error) {
    process.stdout.write(`${JSON.stringify({
      ok: false,
      error: error instanceof Error ? error.message : String(error)
    })}\n`);
  }
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

let nextPort = basePort;
let attempts = 0;
server.on('error', (error) => {
  if (error && error.code === 'EADDRINUSE' && basePort !== 0 && attempts < 9) {
    attempts += 1;
    nextPort = basePort + attempts;
    server.listen(nextPort, host);
    return;
  }
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exit(1);
});

server.on('listening', () => {
  const address = server.address();
  const activePort = typeof address === 'object' && address ? address.port : nextPort;
  process.stdout.write(`${JSON.stringify({
    ok: true,
    type: 'ready',
    url: `http://${host}:${activePort}/`,
    port: activePort,
    transport: 'local-only-sse'
  })}\n`);
});

server.listen(nextPort, host);
