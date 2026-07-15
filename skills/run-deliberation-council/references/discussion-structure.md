# Structured Roundtable Discussion

## Contents

1. Discussion contract
2. Phase sequence
3. Public turn actions
4. Core-contradiction checkpoint
5. Dynamic routing
6. Position revision
7. Learning-mode rendering

## 1. Discussion contract

Run a decision-directed conversation, not a sequence of speeches. Every public turn after the opener must act on the shared transcript and add decision-relevant information.

The host controls phase, synchronization, and turn order. The host does not decide what a participant believes, rewrite a public message, or force agreement.

## 2. Phase sequence

### DEFINITION

Ask participants to define the key concept, threshold, or unit of judgment when divergent definitions could create false disagreement. Each definition must imply a concrete test.

Skip or combine this phase when the terms are already operationally clear.

### INITIAL_POSITION

Publish the independently anchored position of each starting participant. Require a current judgment, strongest ground, applicability boundary, and one reversal condition.

Only the first speaker may stand alone. Later initial turns may reference earlier public messages even though their private anchors were formed independently.

### CROSS_EXAMINATION

Route turns toward specific public claims. Prefer direct questions, counterexamples, missing evidence, competing definitions, and conditions that could reverse a judgment.

Do not give everyone an equal number of turns after the opening sequence. Give the floor to the role most likely to reduce the decisive uncertainty.

### CORE_CONTRADICTION

After one material exchange, identify exactly one unresolved contradiction most likely to change the recommendation. State it neutrally as competing claims or decision conditions, then route the next turn to the participant best able to test it.

Do not summarize every contribution. Do not introduce a new conclusion through the checkpoint.

### POSITION_UPDATE

Require affected participants to say whether they revise, maintain, or need one decisive human fact. Each update must name the public message, evidence, or unresolved condition responsible.

### CONVERGENCE

Assign `CONSENSUS`, `PROVISIONAL_CONSENSUS`, `SPLIT_DECISION`, or `INSUFFICIENT_INFORMATION` from the public record. Return the decision condition separating remaining positions.

## 3. Public turn actions

Internally classify each public turn as one primary action:

- `陈述` — publish a decision-relevant proposition and basis;
- `质疑` — challenge an assumption, definition, inference, or evidence quality;
- `补充` — add a missing variable or condition without rejecting the prior claim;
- `反驳` — offer a reason or counterexample that would make a prior claim fail;
- `追问` — request an answer whose absence blocks judgment;
- `修正` — change a published position and identify the trigger;
- `综合` — reconcile public claims under explicit conditions.

Do not render labels by default. Show them in learning mode when they make the process easier to study.

## 4. Core-contradiction checkpoint

Use this compact checkpoint after a material round or when discussion diffuses:

```text
当前最深分歧：{claim_a} 与 {claim_b} 对 {decision_variable} 的判断冲突。
决定性问题：{single_question}
下一位：{role_name}，因为其框架最适合检验 {reason}。
```

In learning mode, show this checkpoint to the user. In normal room mode, use it internally unless the room needs reorientation.

## 5. Dynamic routing

Choose the next speaker by expected information gain:

1. answer a named direct question;
2. test an assumption that could reverse the decision;
3. resolve a conflict between definitions or evidence standards;
4. let the challenged role answer a material objection;
5. invite the least-heard distinct perspective;
6. request a visible position update.

Do not pre-script the entire order. Broadcast the latest exact public event before selecting or triggering the next speaker.

## 6. Position revision

Position change is evidence of deliberation, not a requirement for every participant. Accept three outcomes:

- `我修改判断` — state old and new position plus the public trigger;
- `我维持判断` — name the strongest objection and why it remains insufficient;
- `需要真人补充` — name the single missing fact separating the positions.

Reject vague convergence such as “综合来看大家都有道理.”

## 7. Learning-mode rendering

When the user wants to learn from the discussion, add only the annotations that expose structure:

- action label for consequential turns;
- the deepest contradiction after each material round;
- a compact argument map when at least three claims or branches interact;
- the public-message path that changed a position;
- two to four reusable discussion lessons tied to actual turns.

Keep the natural conversation primary. Do not interrupt every message with host commentary or transform the transcript into detached summaries.
