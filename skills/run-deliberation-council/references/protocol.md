# Shared-Room Deliberation Protocol

## Contents

1. Decision contract
2. Role card
3. Two-layer context
4. Public room event
5. Delivery algorithm
6. Speaking and routing rules
7. Role lifecycle
8. Persistent room lifecycle and user controls
9. Consensus gate
10. Live rendering
11. Failure handling

## 1. Decision contract

```yaml
decision_question: "Concrete question"
decision_owner: "Authorized human"
constraints: []
success_criteria: []
known_facts: []
unknown_facts: []
output_mode: "learning|room|compact"
render_surface: "main_chat|right_side_local"
role_mode: "theory_figure|functional|hybrid"
room_lifecycle: "persistent|one_off"
live_render: true
max_active_roles: 3
max_public_expert_turns: 9
```

## 2. Role card

```yaml
role_id: "role_01"
role_kind: "theory_figure|functional_expert"
display_name: "Person or function"
theory_or_method: "Qualified framework"
framework_status: "established_theory|validated_method|practice_framework|user_requested_persona"
evidence_grade: "A|B|C|U"
judgment_variable: "Unique decision variable"
core_proposition: "Decision-relevant claim"
must_answer: []
applicability_boundary: "Where the framework stops"
evidence_threshold: "Required support"
reversal_condition: "What could change the position"
predictable_bias: "Expected one-sided failure"
authority_boundary: "What the role may not decide"
reconstruction_label: "Theory-grounded reconstruction or functional role"
status: "active|retired"
```

Reject a role when its only difference is tone, title, or personality.

## 3. Two-layer context

### Private expert context

Each expert owns:

- role card;
- private initial anchor;
- private unpublished working state;
- all public room events received so far.

Private contexts never merge.

### Canonical public room log

The controller owns one ordered log:

```yaml
room_id: "room_001"
room_version: 0
room_status: "active|paused|closed"
discussion_phase: "DEFINITION|INITIAL_POSITION|CROSS_EXAMINATION|CORE_CONTRADICTION|POSITION_UPDATE|CONVERGENCE"
participants: []
public_events: []
unresolved_contradiction: null
pending_human_fact: null
```

All active experts must receive the same ordered public events. The room log is shared conversation, not shared hidden reasoning.

## 4. Public room event

Use structured metadata internally while keeping `public_message` natural:

```json
{
  "event_type": "PUBLIC_ROOM_EVENT",
  "room_id": "room_001",
  "room_version": 3,
  "speaker_role_id": "role_02",
  "addressed_to": ["role_01"],
  "public_message": "我想回应招聘专家刚才关于并发岗位的判断……",
  "references": ["turn_01", "claim_C01"],
  "stance_delta": "maintain|revise|question|none"
}
```

The user sees only the role name and `public_message`.

Use the same public log for user interventions:

```json
{
  "event_type": "USER_ROOM_EVENT",
  "room_id": "room_001",
  "room_version": 4,
  "speaker_role_id": "user",
  "public_message": "我补充一个条件：候选人的薪资不能超过……",
  "instruction": "continue|deepen|direct_reply|add_role|replace_role|pause|summarize|end|none"
}
```

Append and display the user's exact natural-language input, then deliver the identical event to every active expert. Do not reduce it to a host interpretation before broadcast.

## 5. Delivery algorithm

```text
create isolated experts with fork_turns=none
collect one private anchor from each expert
host publishes room opening
publish room opening to the selected user-visible surface
wait for the surface acknowledgement

while not stopped:
    select next speaker
    trigger speaker with followup_task
    receive natural-language public_message
    append event and increment room_version
    immediately publish speaker and exact public_message to the selected surface
    wait for the surface acknowledgement
    for every other active expert:
        deliver identical event with send_message
    verify the next speaker has the latest room version

when the user intervenes:
    append and display exact USER_ROOM_EVENT
    broadcast it to every active expert
    apply any explicit room-control instruction

request public position updates
apply consensus gate
render the canonical room log
pause or preserve the room unless an end condition is explicit
```

Do not replace the broadcast loop with controller summaries. If an event is long, broadcast the exact public message plus references, not an interpretive rewrite.

## 6. Speaking and routing rules

### Natural-language turn

A good public turn:

- is normally 80-220 Chinese characters;
- names the prior speaker or idea being addressed;
- adds a reason, question, counterexample, evidence need, or revision;
- separates known fact from assumption when important;
- sounds like a professional conversation, not a report schema.

### Turn routing

Route by expected information gain:

1. direct question needing an answer;
2. assumption that could reverse the decision;
3. contradiction between two public messages;
4. role best qualified to judge new evidence;
5. affected role that should revise or maintain.

The controller may explain the main routing choice in learning mode, but must not speak on behalf of the selected expert.

### Public-room synchronization

- Increment `room_version` after every public turn.
- Display each appended public turn before requesting the next expert turn.
- Broadcast before triggering the next speaker.
- Deliver to every active non-speaker, not only the person addressed.
- If a role missed an event, resend the exact event or full public snapshot.
- A role joining late receives the full public log plus its own role card.

## 7. Role lifecycle

- `CREATE_ROLE`: add a missing evaluation function.
- `ACTIVATE_ROLE`: invite an existing role to speak.
- `REPLACE_ROLE`: replace a mismatched role.
- `RETIRE_ROLE`: remove a completed or redundant role while preserving its public messages.

Announce membership changes publicly.

## 8. Persistent room lifecycle and user controls

Keep the room `active` after a discussion cycle unless the user requested a one-off result or explicitly ends it. Ordinary follow-up input in an active room becomes a `USER_ROOM_EVENT` and continues with the same roster and exact public log.

Support these natural-language controls:

- `继续` — continue from the unresolved contradiction;
- `深入 {topic}` — focus the next exchange on one variable;
- `让 {A} 回应 {B}` — route the next public turn without hiding it from other participants;
- `加入 {person_or_function}` — qualify and create a missing participant;
- `替换 {A} 为 {B}` — preserve A's public history, then add B with the full public log;
- `暂停讨论` — set room status to `paused` without destroying state;
- `当前总结` — return a checkpoint without closing the room;
- `结束聊天室`, `退出聊天室`, or an explicit return to the main assistant — set status to `closed` and stop dispatching participants.

If a user invokes an incompatible workflow or clearly asks the main assistant rather than the room, end or suspend the room and state the transition.

When a live participant context is lost, spawn a replacement with `fork_turns="none"`, its role card, and the full canonical public log. Publicly label the continuity as `上下文重建`; never imply that unpublished private state survived.

## 9. Consensus gate

### CONSENSUS

Public objections that could change the recommendation were resolved.

### PROVISIONAL_CONSENSUS

The room agrees conditionally, with explicit assumptions still requiring validation.

### SPLIT_DECISION

Roles remain divided for material, legitimate reasons. Return the condition separating them.

### INSUFFICIENT_INFORMATION

A missing human fact dominates and further discussion would only speculate.

Do not count votes as the primary test.

## 10. Live rendering

Render each host, user, and participant event incrementally through the user-visible progress channel. A user should be able to read A before B is requested, and B before C is requested.

When `render_surface` is `right_side_local`, use the bundled local live-room transport described in `live-room-surface.md`. The page acknowledgement must arrive before the controller broadcasts the event and requests the next speaker. Keep the main chat compact instead of duplicating the full transcript.

After a cycle, return the durable record:

```markdown
### 问题与角色

**主持人**：今天讨论……本轮邀请……

### 共享聊天室实录

**角色 A**：我先说我的判断……

**角色 B → 角色 A**：我不同意你刚才关于……

**角色 C**：我认为你们两位都忽略了……

**角色 A → 角色 C**：你提出的条件会改变我的判断……

### 观点变化

- **角色 A**：原判断 → 新判断；触发消息：角色 C 第 3 轮发言。
- **角色 B**：维持判断；尚未解决：……

### 主持人结论

- **状态**：……
- **建议**：……
- **分歧**：……
- **下一步**：……
```

Learning mode may annotate the turning point and lessons after the transcript. Do not interrupt every public turn with controller analysis.

If the interface cannot render incrementally, state `过程为后台执行，以下为完整实录` and do not describe the experience as live.

## 11. Failure handling

- If agents output detached reports, request a shorter public reply that addresses the previous room turn.
- If messages were not broadcast, do not describe the result as a shared-room run.
- If expert messages were buffered until completion, do not describe the result as real-time.
- If the right-side page did not acknowledge a turn, stop routing new speakers until the display is restored or explicitly fall back to incremental main-chat rendering.
- If one role dominates, route to the least-heard material perspective.
- If all roles agree quickly, ask one role to test the strongest shared assumption publicly.
- If roles converge by imitation, compare their private anchors to the public convergence and disclose the risk.
- If an expert misses a room version, resynchronize before allowing it to speak.
- If a live expert context is lost, rebuild from the full public log, label the reconstruction, and do not fabricate private continuity.
- If the user adds a fact, publish it as an exact user room event and broadcast it to everyone.
