# Theory-Grounded Participant Construction

## Contents

1. Start from judgment variables
2. Select role type
3. Qualify a theory
4. Rank qualified candidates
5. Qualify its representative
6. Build the role card
7. Preserve fidelity
8. Check the roster

## 1. Start from judgment variables

Translate the user's question into the few variables that could change the decision. Do not begin with famous names, job titles, or a desire for balanced personalities.

For each candidate variable, ask:

- What concrete choice does this variable distinguish?
- Which theory, method, or professional discipline can judge it?
- Is another participant already covering it?
- What becomes invisible if this variable is removed?

Discard variables that are merely different wording for the same decision test.

## 2. Select role type

Use `theory_figure` when a durable, attributable framework has a qualified representative and enough material for faithful reconstruction.

Use `functional_expert` when the variable depends on current law, local market facts, implementation ownership, organization-specific knowledge, or a field without one defensible representative.

Use a `hybrid` roster when durable theory needs current operational correction. A practical council may contain named theory figures and functional experts together.

Do not force every variable into a historical personality. Do not downgrade a qualified theory figure to a generic title merely because a functional label is easier.

## 3. Qualify a theory

Admit a theory only when all five gates pass:

1. `clear_claim` — state its core proposition, decision method, and applicability boundary.
2. `tested` — show that it has undergone meaningful use, criticism, empirical testing, or long-term practice; popularity alone does not count.
3. `independently_checkable` — its value can be evaluated through primary work, research, cases, or established practice without relying on the creator's personal success story.
4. `decision_relevant` — it changes how the current choice is judged.
5. `material_sufficient` — enough reliable material exists to distinguish the framework from slogans or scattered quotations.

If any gate is unclear, use a better-supported theory or a functional expert.

## 4. Rank qualified candidates

Passing the gate does not make two frameworks equally suitable. When several candidates cover the same variable, rank them in this order:

1. a directly applicable domain theory or method supported by primary empirical research, synthesis, or authoritative standards;
2. a directly applicable professional method with sustained independent practice and criticism;
3. an adjacent general theory that uniquely changes the decision and clearly states the inference boundary;
4. a branded or proprietary practice framework, admitted only when no stronger direct candidate covers the variable;
5. a user-requested persona, included transparently without upgrading its evidence status.

Do not let fame, memorable language, or ease of role-play displace a more direct and better-supported researcher, theory, or professional standard. If a practice framework is selected for actionability, label it `practice_framework` rather than presenting it as an established theory.

Assign a visible evidence grade:

- `A` — direct, independently checkable empirical theory, synthesis, or authoritative method;
- `B` — established professional method with meaningful independent use and criticism;
- `C` — adjacent or proprietary framework used as a bounded inference;
- `U` — user-requested perspective whose qualification is uncertain.

## 5. Qualify its representative

Choose a representative only when:

- the framework is materially attributable to that person;
- the person's work supports more than a recognizable speaking style;
- the figure covers a unique variable in this room;
- the figure's public material supports a faithful account of method and limits;
- applying the framework to this question does not require inventing a private belief or current opinion.

Fame, charisma, MBTI, biography, and communication style are not qualification criteria. A user-named figure may enter as the user's requested perspective, but label weak theoretical support instead of presenting it as system-qualified.

## 6. Build the role card

```yaml
role_id: "role_01"
role_kind: "theory_figure|functional_expert"
display_name: "Person or function"
theory_or_method: "Attributable framework"
framework_status: "established_theory|validated_method|practice_framework|user_requested_persona"
evidence_grade: "A|B|C|U"
core_proposition: "Decision-relevant claim"
judgment_variable: "Unique variable covered"
must_answer: []
applicability_boundary: "Where the framework stops"
evidence_threshold: "Support required for a claim"
reversal_condition: "What could change the role's position"
predictable_bias: "Expected one-sided failure"
authority_boundary: "What this role may not decide"
source_basis: "Primary or authoritative material basis, or uncertainty label"
reconstruction_label: "Theory-grounded reconstruction"
status: "active|retired"
```

For a functional expert, replace biographical imitation with actual professional standards, evidence requirements, and authority boundaries.

## 7. Preserve fidelity

Treat a named participant as a transparent agent reconstructed from public theory, not as the real person.

- Attribute established propositions to the framework.
- Label a new application as an inference from the framework.
- Never invent direct quotations, unpublished reasoning, private beliefs, or views on events outside the person's documented work.
- Avoid theatrical voice imitation when it weakens analytical fidelity.
- Verify decision-critical theory claims from primary or authoritative sources when tools and stakes justify it.
- If reliable reconstruction is impossible, disclose the limitation and replace the figure with a functional expert.

The private prompt may encode method, recurring questions, boundaries, and known biases. It must not ask the agent to fabricate hidden chain-of-thought or claim authentic identity.

## 8. Check the roster

Before spawning participants, verify:

- every material judgment variable has an owner;
- each participant is the strongest direct qualified candidate found for its variable, or the downgrade is disclosed;
- every participant owns a distinct variable or correction function;
- removing each participant would leave a named blind spot;
- the room contains a challenger when consensus would otherwise be cheap;
- the room contains an implementation or current-facts role when the decision must be executed;
- the roster is the smallest one that can surface the decisive contradiction;
- the host can explain in one sentence why each participant was invited.

Default to three participants and cap active membership at five unless the user explicitly requests a larger council.
