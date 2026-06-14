# Submission copy — Compass-BlackBox IQ

Ready-to-paste text for the Innovation Studio project page.

---

## Project name
Compass-BlackBox IQ

## Tagline (one line)
The flight recorder for autonomous agents — governed memory & competence in plain text, grounded on Microsoft's F.A.M. intelligence layer.

## Keywords / tags
Microsoft Foundry · Foundry IQ · Work IQ · Fabric IQ · Microsoft 365 Copilot · MCP (Model Context Protocol) · AI agent governance · governed memory · audit trail · human-in-the-loop · grounded theory · git · Obsidian · reasoning agents · decision provenance · skill auditing · TypeScript

---

## Short description (2–3 sentences)
Compass-BlackBox IQ governs the layer no one else does — an autonomous agent's **memory and competence**. Every action becomes an immutable, cited decision record in a git repo the human owns; an audit mines those records, drafts new skills from the notes the agent overlooked, and a human approves them. The agent grounds on all three Microsoft IQ surfaces — **F.A.M.: Facts (Foundry IQ), Activity (Work IQ), Meaning (Fabric IQ)** — kept strictly orthogonal to the governed vault.

---

## Full description

**The problem.** Microsoft's stack governs what an agent is *allowed* to do — identity, permissions, actions, grounding. Nobody governs what it *knows*, *did*, and *learned*. When an agent makes a bad call, permission systems tell you it was *allowed*, not *why*. And when agents "learn," that learning is invisible — buried in vendor memory you can't read, diff, or revoke.

**The idea.** An agent's entire memory — decisions, skills, knowledge — lives as plain Markdown in a git repository the human owns (Obsidian-compatible). Every write is a commit; the git log *is* the audit trail. The invariant, enforced in the tool layer (not the prompt): the agent's only write paths are **decision records** and **proposals**; promotion into active memory happens only through the human-gated `approve_proposal`. **Agents propose; humans promote.** `git revert` rolls back a skill — but the blackbox is append-only: **behavior is revertible, history is not.**

**Grounded truth — F.A.M.** The agent grounds across Microsoft's intelligence layer as three lenses: **Foundry IQ → Facts** (institutional reference), **Work IQ → Activity** (live Microsoft 365 work context), **Fabric IQ → Meaning** (a business ontology). Foundry IQ and Work IQ are live against real endpoints; Fabric IQ is authored as a real Fabric-IQ-format ontology and wired as an honest roadmap. All grounding is read-only, source-tagged, and **never merged** into governed memory.

**The engine.** Competence is measured with grounded theory's **constant comparative analysis** — `log_decision` is initial coding, `run_audit` is constant comparison, the proposal is the memo, the human gate applies the *fit* and *work* acceptance tests, and promotion is theoretical saturation.

**Why it wins on the rubric.** Multi-step reasoning you can read (plan → recall → ground → act → log → audit → propose → approve → re-run). Safety enforced in the tool layer, not the prompt. Server-verified citations. Agent memory as a human-owned git repo. Plain Markdown + a live Obsidian graph + a one-call approval — and an auth-gated MCP server. Nothing is faked: every claim is backed by a live artifact.

**Microsoft governs permissions, actions & grounding. Compass-BlackBox IQ governs the layer no one else does — memory & competence, in 100% inspectable plain text.**

---

## Stack
TypeScript · MCP SDK (streamable HTTP + stdio) · Microsoft Foundry Agent Service · Foundry IQ (Azure AI Search) · Work IQ (M365 Copilot Gateway) · Fabric IQ (RDF/OWL ontology) · Flask · simple-git · gray-matter · Obsidian-compatible vault

## Links
- Repo: github.com/JeremyGracey-AI/Agents-League-Hackathon-Compass-BlackBox-IQ
- Deck: `docs/submission/slide-*.png`
- Video: _[add URL]_
