# Local Right-Side Live Room

## Contents

1. Purpose and boundary
2. Start the local transport
3. Open the right-side room
4. Publish public events
5. Enforce ordering
6. Handle user interventions
7. Preserve or stop the room
8. Failure handling

## 1. Purpose and boundary

Use this surface when the user wants the full discussion outside the main chat, especially for requests such as “在右侧打开”, “像聊天记录一样”, “出现一条就发一条”, or “不要等内部讨论完再一起展示”.

The bundled transport is local-only:

- it binds to `127.0.0.1`;
- it serves one page and sends events through Server-Sent Events;
- it does not call an external API or model;
- it does not make the multi-agent reasoning free: expert generation still consumes the normal model allowance.

Do not replace genuine expert agents with scripted messages merely to make the page faster.

## 2. Start the local transport

Locate a Node.js executable. Prefer the bundled workspace dependency loader when available; otherwise use an installed `node`.

Start the server from the skill folder and retain the running session ID:

```text
<node> scripts/live-room-server.mjs --port 4321
```

Use a PTY-capable long-running command. The server tries ports `4321` through `4330` when the preferred port is occupied and prints one ready record:

```json
{"ok":true,"type":"ready","url":"http://127.0.0.1:4321/","port":4321,"transport":"local-only-sse"}
```

Treat the returned URL and process session ID as room state. Preserve them in compaction summaries while the room remains active.

## 3. Open the right-side room

When the Browser skill is available, read and follow it, select the in-app browser for the returned local URL, make the browser visible, and open the page as the user-facing room. Keep that tab as `handoff` while the room is active and `deliverable` after a completed cycle.

Never use a `file://` page for live publishing. Browser security policies may prevent controlling or refreshing it, and a static file cannot receive incremental events safely.

If browser control is unavailable, give the user one clickable local URL and continue publishing after they open it. Keep the main chat compact.

## 4. Publish public events

Write one JSON command plus a newline to the running server session. Do not shell-interpolate public messages when a direct stdin write is available.

Reset for a new room:

```json
{"type":"reset","topic":"怎么才能保留员工？","status":"独立锚点建立中","roles":["离职机制研究员 · Job Embeddedness","工作体验专家 · JD-R","总体回报专家 · Total Rewards"]}
```

Publish one host, expert, or user turn:

```json
{"type":"turn","kind":"expert","avatar":"离","speaker":"离职机制研究员","action":"质疑","reply":"回应：工作体验专家","message":"公开自然语言原文","status":"讨论进行中"}
```

Update a waiting or paused state without adding a turn:

```json
{"type":"status","status":"总体回报专家正在回应"}
```

The server responds with an acknowledgement. A successful public turn includes its sequence number:

```json
{"ok":true,"type":"turn","count":4,"sequence":4}
```

## 5. Enforce ordering

For every public turn, follow this exact order:

1. Receive the expert's natural-language public message.
2. Write the exact message to the live-room server.
3. Wait for `ok: true` and the expected sequence.
4. Only then broadcast the identical message to every other active expert.
5. Only after broadcast invite the next speaker.

Before waiting on a slow expert, publish a status such as `{role} 正在回应`. Status is not a substitute for a public turn.

Do not post the full transcript again in the main chat when the right-side room is active. Use the main chat only for short state changes, blockers, or a concise cycle close.

## 6. Handle user interventions

When the user writes while a room is active:

1. Publish the user's exact text as a `kind: "user"` turn before interpreting it.
2. Broadcast the identical `USER_ROOM_EVENT` to every active expert.
3. Apply `continue`, `deepen`, `direct_reply`, `add_role`, `replace_role`, `pause`, `summarize`, or `end` only after the public event is visible.
4. If the user asks to change direction without naming the direction, pause the room and let the host ask one short question in the live room.

## 7. Preserve or stop the room

Keep the server and right-side tab alive while the room is persistent. A completed discussion cycle does not automatically stop the transport.

On explicit room end, write:

```json
{"type":"stop"}
```

Then finalize or close the browser tab according to the user's request. Do not stop an active room merely because one cycle finished.

## 8. Failure handling

- If the server rejects a turn, do not trigger the next expert. Retry once with valid JSON or report the blocker.
- If the page disconnects but the server remains alive, reopen the same local URL; the current room snapshot is replayed automatically.
- If the server process is lost, start a new server and republish the canonical public log as a reconstructed snapshot before continuing. Label continuity as `页面连接重建`, not expert-context reconstruction.
- If incremental display cannot be restored, fall back to commentary-channel incremental turns and disclose the surface limitation. Never claim right-side real-time publishing when messages were buffered.
