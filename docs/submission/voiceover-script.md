# Voice-over script — Compass-BlackBox IQ

Written to be **read aloud** over the generated clips. ~560 words ≈ **3:45–4:00** at a calm
pace (~145 wpm) — under the 5:00 cap. Each block = one scene/clip. Pause briefly between blocks.
Delivery: calm, confident, unhurried — a senior engineer explaining something they're sure of.

---

### 1 · Cold open — *thesis card / compass hero*
> Microsoft's stack governs what an autonomous agent is *allowed* to do — its identity, its permissions, its actions, what it's grounded on. But nobody governs what it **knows**, what it **did**, and how it **learns**. That layer is invisible — locked inside vendor memory you can't read, diff, or revoke. **Compass-BlackBox IQ is that missing layer.**

### 2 · The gap — *slide 02*
> Three layers govern an autonomous agent. The first two have a control plane — identity and permissions, approval gates and spend caps. The third — its **memory and its competence** — has nobody. That's the layer we built.

### 3 · Governed memory — *architecture diagram (`architecture.png`)*
> Here's how. The agent's entire memory — its decisions, its skills, its knowledge — lives as plain Markdown in a Git repository **the human owns**. Every action becomes an immutable, cited decision record. The Git log *is* the audit trail. And the invariant is enforced in the tool layer, not the prompt: the agent can only ever write decisions and proposals. It can never touch its own active memory.

### 4 · F.A.M. grounding — *slide 03*
> To reason, it grounds across Microsoft's intelligence layer — **F.A.M.**: Facts from Foundry IQ, Activity from Work IQ, and Meaning from Fabric IQ. Three lenses on the enterprise world, each earning its own citation. But grounding is **rented** and read-only — it's never merged into the memory the human owns. That seam is the whole thesis.

### 5 · The engine — *slide 05 + slide 06*
> Then it gets better at its job. An audit mines the decision records and finds where the agent freelanced — where it acted without citing what it should have known. It drafts a new skill from the notes the agent overlooked, and a human approves it. **Agents propose; humans promote.** We measure competence the way a researcher builds theory — constant comparison over the agent's own decisions, with *fit* and *work* as the test.

### 6 · Safety & the blackbox — *over the loop clip (slide 05) or the architecture diagram*
> `git revert` rolls back a skill — but the blackbox is append-only. **Behavior is revertible; history is not.** And when the agent freelances, its citations come back honestly **empty** — a designed signal, never patched over.

### 7 · It runs — *slide 04*
> And none of this is a concept. It runs. Foundry IQ and Work IQ ground **live** against real Microsoft endpoints. Every decision is a real, server-verified record. Nothing here is faked — every claim is backed by a live artifact you can open in the repo.

### 8 · Close — *slide 07 (platform) → slide 08 (close)*
> Three layers, one platform: **Compass Rose** builds the skills, **GM Louis** reasons, and **BlackBox IQ** governs and records. Microsoft governs permissions and grounding. We govern the layer no one else does — an autonomous agent's **memory and competence**, in a hundred percent inspectable plain text. Agents propose. Humans promote.

---

**Trim levers if you run long:** drop block 6's middle sentence, or shorten block 3 to its first
and last sentences. **Honesty guardrail:** only Foundry IQ + Work IQ are described as *live*;
Fabric IQ is named as the Meaning lens but never called live (it's an authored roadmap).
