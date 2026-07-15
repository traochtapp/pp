---
name: run-deliberation-council
description: Run a live, persistent shared-room multi-agent council while every participant keeps an independent private context. Derive missing judgment variables, select qualified theory-grounded figures or functional experts, and use a structured roundtable of definition, challenge, revision, and convergence. Broadcast and immediately display every natural-language public turn so all active agents and the user see the same conversation, optionally streaming each turn to a local right-side chat page. Use for 多 Agent 讨论、多专家会诊、专家委员会、理论人物圆桌、创建合适的讨论人物、让不同角色在一个对话框实时沟通、所有 Agent 看见彼此发言、共享聊天室但独立大脑、右侧页面或侧边栏逐条显示讨论、像聊天记录一样实时发布、用户插话并换方向、招聘/产品/技术/商业/法律等跨专业决策, or whenever the user wants genuine group deliberation rather than isolated answers or controller-mediated interviews.
---

# Run Deliberation Council

## Objective

Run one public expert room with multiple independent brains:

- each expert keeps a private role context and private working state;
- roles are selected from the question's missing judgment variables, with theory and representative figures chosen only when qualified;
- all active experts receive the same public room transcript after every turn;
- experts speak to one another in natural language;
- the controller manages turn order and transcript delivery, not the content of expert replies;
- the user sees each public message as it is produced and can intervene while the room remains active.

Do not implement this as parallel private answers followed by a summary. Do not implement it as the controller privately relaying one extracted claim to one expert while the others remain unaware.

## Load the operating resources

Read [references/role-construction.md](references/role-construction.md) before selecting participants or creating role cards.

Read [references/discussion-structure.md](references/discussion-structure.md) before opening or resuming a discussion cycle.

Read [references/protocol.md](references/protocol.md) before creating or dispatching roles.

Read [references/prompt-templates.md](references/prompt-templates.md) when creating private anchors, opening the room, broadcasting events, requesting a public reply, adding a role, or closing the discussion.

Read [references/live-room-surface.md](references/live-room-surface.md) when the user wants the discussion in a right-side page, local live room, or separate chat-record surface rather than the main conversation.

## Use the two-layer context model

Maintain both layers throughout the run:

1. **Private context per expert** — role card, private initial stance, and that expert's unpublished working state.
2. **Canonical public room log** — every natural-language message published by the host or an expert, in the same order for everyone.

Sharing the public room does not mean sharing private reasoning. Never expose or request private chain-of-thought. Publicly exchange positions, reasons, evidence labels, questions, objections, and revisions.

## Run the workflow

### 1. Define the decision contract

Extract the concrete question, owner, constraints, success criteria, known facts, unknown facts, output mode, rendering surface, active-role limit, and public-turn budget.

Proceed with labeled assumptions when safe. Ask one short question only when a missing fact would make the role roster or discussion meaningless.

Use `learning` mode when the user wants to observe or learn from the communication process. Use `room` for a clean natural-language transcript and `compact` only when the user requests a short result.

Use `right_side_local` as the rendering surface when the user wants a separate right-side chat page. Keep `main_chat` only when no separate surface is requested or available. Do not change the discussion depth or turn budget merely because a different surface is selected.

### 2. Construct theory-grounded participants

Map the decision into missing judgment variables before naming anyone. For each material variable, select the strongest qualified theory or method, then choose its representative figure when the theory, attribution, materials, and current relevance pass the qualification gate.

When multiple candidates cover the same variable, prefer the most direct and best-supported domain theory over an adjacent famous framework. Label whether the participant represents an established theory, validated method, practice framework, or user-requested persona so the user can judge its evidentiary weight.

Use three participant types:

- `theory_figure` — a clearly attributable framework represented by a real thinker or researcher;
- `functional_expert` — a current professional judgment function when no qualified figure covers the variable;
- `hybrid` — theory figures for durable reasoning plus functional experts for current facts, law, implementation, or local constraints.

Default to three active participants, use two for a narrow tradeoff, and expand up to five only when a material variable remains uncovered. Reject duplicate frameworks, fame-only personas, and roles distinguished only by tone. Present each participant's theory, unique variable, boundary, and invitation reason before the room starts. Ask for confirmation only when the user requests roster control or when the roster choice would materially change a high-impact decision.

Treat every named figure as a transparent theory-grounded reconstruction, not the real person's current speech. Never invent quotations, private beliefs, or unsupported positions. Fall back to a functional expert when faithful reconstruction is not possible.

### 3. Create independent private anchors

Call `spawn_agent` for each role with `fork_turns="none"`. Send only the decision contract, common facts, and that role's card.

Ask each expert to create a concise private initial stance before the public room opens. Do not broadcast these anchors and do not render them as the discussion. Their purpose is to reduce conformity after the first public speaker sets an anchor.

Respect concurrency limits by creating roles in batches without merging their contexts.

### 4. Open the persistent live room

Create an active room state that retains the decision contract, participants, canonical public log, unresolved contradiction, room version, and current discussion phase. The room remains active across ordinary user follow-ups until the user ends it, explicitly returns to the main assistant, invokes another workflow, or asks for a one-off closed result.

When using `right_side_local`, start the bundled local transport, open its returned loopback URL in the visible in-app browser, and publish a reset containing the topic, status, and qualified role list. Confirm that the right-side room is ready before requesting any public expert turn. The transport is only a display channel; it never replaces independent experts or the canonical log.

The host posts a short natural-language opening containing the question, common facts, role list with theory basis, and discussion rule. Show and acknowledge the opening on the selected rendering surface before broadcasting it. Publish the user's later intervention as an exact `USER_ROOM_EVENT`, show it in the room, and broadcast it to every active expert before anyone replies.

Choose an opening expert. Call `followup_task` and ask for one natural-language public message. The expert may use its private anchor but must speak naturally, not return visible JSON.

Append the message to the canonical public room log.

### 5. Broadcast every public turn to everyone

After each expert speaks:

1. create an internal `PUBLIC_ROOM_EVENT` with the room version, speaker, addressed roles, public message, and referenced public claims;
2. append the exact message to the canonical log and update the room version;
3. immediately publish the role name and exact natural-language message to the selected rendering surface; wait for its acknowledgement and do not buffer turns;
4. call `send_message` for every other active expert so they all receive the same new public turn;
5. choose the next speaker only after the broadcast;
6. call `followup_task` for that speaker and require it to respond using the public room it has seen.

Before waiting on a slow expert in a right-side room, update the visible room status with `{role} 正在回应`. This is presence feedback only and does not count as a public turn.

Do not privately rewrite the message before broadcasting. Internal metadata may be structured, but the public message shown to the user must be natural language.

If delivery order is uncertain, include the current room version and full public snapshot in the next speaker task. Never allow a role to respond from a stale transcript without disclosing it.

### 6. Run the structured roundtable

Run the smallest useful sequence of phases:

1. `DEFINITION` — expose materially different definitions of the key concept or decision threshold;
2. `INITIAL_POSITION` — publish independently anchored judgments;
3. `CROSS_EXAMINATION` — challenge, supplement, rebut, question, revise, or synthesize specific public claims;
4. `CORE_CONTRADICTION` — identify the one unresolved conflict most likely to change the decision and route the next turn toward it;
5. `POSITION_UPDATE` — require affected participants to revise, maintain, or request one decisive human fact;
6. `CONVERGENCE` — assign a decision status without erasing legitimate disagreement.

Combine definition and initial position when the key terms are already shared. Give every starting expert one public turn, but allow later speakers to respond to all earlier public messages rather than producing a prewritten independent answer. After the opening sequence, use dynamic turn order rather than fixed round-robin.

After the opening sequence, route 2-5 additional turns by expected information gain:

- answer a direct question;
- challenge a decision-changing assumption;
- reconcile two conflicting public claims;
- request missing evidence;
- revise a published position;
- surface an uncovered dimension.

Every turn after the opener must reference, answer, challenge, or build on at least one earlier public message. Generic standalone speeches do not count as dialogue.

Internally label each turn action as `陈述`, `质疑`, `补充`, `反驳`, `追问`, `修正`, or `综合`. Show the label only in learning mode when it helps the user understand the discussion structure.

Experts may address one another by role name. All other active experts still receive and retain that exchange, even when not directly addressed.

### 7. Change the room membership when needed

Use `CREATE_ROLE`, `REPLACE_ROLE`, or `RETIRE_ROLE` when a material perspective is missing, a role is mismatched, or a temporary role has completed its work.

Spawn a new role with `fork_turns="none"`, give it its private role card plus the full public room log, and announce its arrival publicly. Never give it another expert's private anchor or unpublished state.

Preserve retired roles' public messages in the room log. Keep no more than five active roles by default.

### 8. Require visible position updates

Before closing, ask affected experts in the public room to state one of:

- `我修改判断` — describe the changed position and the public message that caused it;
- `我维持判断` — explain which public objection remains insufficient;
- `需要真人补充` — identify the single missing fact that separates the positions.

Broadcast these updates like every other public turn.

### 9. Close without erasing disagreement

The controller assigns one status:

- `CONSENSUS`
- `PROVISIONAL_CONSENSUS`
- `SPLIT_DECISION`
- `INSUFFICIENT_INFORMATION`

Judge public reasons and evidence, not vote count. The controller may summarize but must not manufacture statements that no expert published.

A completed discussion cycle does not automatically destroy an active room. Preserve the roster and public state for follow-up questions. End the room only on `结束聊天室`, `退出聊天室`, an explicit return to the main assistant, an incompatible workflow invocation, or a one-off close requested by the user.

## Render the one-chat result

Show every public turn live as it arrives. When rendering in the main chat, return one durable natural-language record:

1. `问题与角色` — short setup and role-selection reason.
2. `共享聊天室实录` — chronological host and expert messages.
3. `观点变化` — who changed, maintained, or requested facts.
4. `主持人结论` — status, recommendation, disagreement, confidence, and next step.

When `right_side_local` is active, keep the chronological transcript and position changes in the right-side page. In the main chat, return only a short cycle status, recommendation, material disagreement, and the available room control. Do not duplicate the full transcript into the main conversation.

In `learning` mode, additionally show:

- why the host selected the next speaker at the main turning point;
- the deepest contradiction selected after each material round;
- a compact argument map when it materially improves understanding;
- the shortest public-message path that changed the decision;
- 2-4 reusable lessons tied to actual room turns.

Do not show raw collaboration metadata, JSON, tool calls, or private anchors. Do not convert the room transcript back into detached expert summaries.

## Stop conditions

Pause the current discussion cycle when the decisive conflict has received a public response and position update, a missing human fact dominates the decision, two consecutive turns add no decision-relevant information, the turn budget is exhausted, or the controller can assign a decision-ready status. Pausing a cycle is not the same as ending a persistent room.

Default to 6-9 public expert turns. Extend only when a new turn can plausibly change the recommendation.

## Quality gate

Before returning, verify:

- the roster was derived from missing judgment variables rather than fame or speaking style;
- every theory figure passed the attribution, boundary, distinctness, material, and relevance gates;
- named figures were labeled as theory-grounded reconstructions and no unsupported quotations or current views were invented;
- experts were spawned with independent private contexts;
- each expert formed a private anchor before seeing the public opener;
- every public expert message was broadcast to all other active experts;
- every public message was shown to the user before the next expert turn was requested;
- when a right-side room was requested, every turn received a successful local publish acknowledgement in the same order as the canonical log;
- user interventions were displayed verbatim on the selected surface before they were interpreted or routed;
- every expert turn after the opener visibly responds to prior public conversation;
- the roundtable exposed a core contradiction rather than collecting parallel monologues;
- at least one expert publicly updated or explicitly maintained a position;
- the displayed transcript uses natural language rather than internal schemas;
- the controller did not invent or privately rewrite expert claims;
- disagreement and missing information remain visible.

If genuine subagents or broadcast messaging are unavailable, label the result `共享聊天室模拟`. If the requested right-side surface fails, fall back to incremental main-chat rendering and disclose the surface limitation. If no interface can display turns incrementally, disclose `过程为后台执行，以下为完整实录`; do not call the experience live. Do not claim that independent agents saw one another's messages when they did not.
