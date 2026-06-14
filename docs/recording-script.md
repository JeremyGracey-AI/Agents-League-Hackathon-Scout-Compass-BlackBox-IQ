# Recording script — Compass-BlackBox IQ (≈ 4:30, hard cap 5:00)

Agents League @ AI Skills Fest 2026 · Reasoning Agents track.

**Before every take:** reseed the vault →
`node ~/GitHub/Agents-League-Hackathon-Compass-BlackBox-IQ/demo/seed-vault.mjs ~/GitHub/scout-compass/vault`
and refresh the Work IQ token → `MPW='…' bash ~/wiq-refresh.sh`.
Use a **fresh agent thread** per beat (gpt-4.1 stays rattled after an error).

**3-pane layout:** GM Louis (Foundry playground) left · Obsidian on `vault/` (graph view) top-right · terminal with `git -C vault log --oneline` bottom-right. For Beat 2, full-screen `http://localhost:5050/trace`.

---

## 0:00 — Hook (≈25s)
**SCREEN:** title card (logo) → the thesis line.
**VO:** "Microsoft's stack governs what an agent is *allowed* to do — its identity, its permissions, its grounding. But nobody governs what it *knows*, what it *did*, and how it *learns*. That layer is invisible — buried in vendor memory you can't read, diff, or revoke. Compass-BlackBox IQ is that missing layer: an agent's memory and competence as plain Markdown in a git repo the human owns."

## 0:25 — Beat 1 · the governed loop (≈90s)
**SCREEN:** 3-pane. Paste the **Initech net-60 trap email** into GM Louis.
**VO:** "GM Louis triages a vendor invoice. It recalls its governed skill, checks the policy, and sees net-60 deviates from our net-30 standard."
**ACTION:** GM Louis routes **`needs_human`**. A new decision record appears **live in Obsidian's graph**, citing `skill-vendor-triage`, `kn-payment-policy`, `kn-escalation-contacts`. Point to the terminal: `[blackbox] dec-NNN … (needs_human, 3 citations)`.
**VO:** "Every action is an immutable decision record — plan, evidence cited, outcome, confidence. The git log *is* the audit trail."
**ACTION:** ask GM Louis to **run an audit** → 3 findings → a draft **proposal** in `proposed/`. **Approve** it (one call). Terminal shows `[human] approve …`. Re-run the same email → it now **cites the promoted skill**.
**VO:** "The audit mines the records, drafts a skill from notes the agent overlooked, and a human approves it. Agents propose; humans promote — auditable, attributable, revertible."

## 1:55 — Beat 2 · F.A.M. grounding, the seam (≈75s)
**SCREEN:** full-screen `http://localhost:5050/trace`. Type the vendor net-60 task → **Trace**.
**VO:** "One task fans out across Microsoft's intelligence layer — F.A.M.: Facts, Activity, Meaning."
**ACTION:** the four panels light up live —
- **Foundry IQ — Facts:** the vendor master (real Azure AI Search KB).
- **Work IQ — Activity:** *"a recent meeting / emails about net-60 and the AP review"* — real Microsoft 365 Copilot, the signed-in user's work context.
- **Fabric IQ — Meaning:** the ontology — `net-60 → TermDeviation → requiresApproval` (marked honestly as authored/roadmap).
- **Vault — governed memory:** the policy and skill the human owns.
**VO:** "Three grounding lenses — rented, read-only, **never merged** — and the governed vault we own. Microsoft governs grounding; Compass-BlackBox IQ governs memory and competence. The seam is right there in one screen."

## 3:10 — Beat 3 · safety & honesty (≈45s)
**SCREEN:** back to terminal + Obsidian.
**VO:** "The invariant is enforced in the tool layer, not the prompt. The agent's only write paths are decisions and proposals — it can't touch active memory."
**ACTION:** ask GM Louis to **revert the blackbox decision** → server **refuses**.
**VO:** "`git revert` rolls back a skill, but the flight recorder is append-only — behavior is revertible, history is not. The MCP endpoint is auth-gated, and when the agent freelances, its citations are honestly empty — a designed signal, never patched over."

## 3:55 — Close (≈30s)
**SCREEN:** the architecture diagram (`docs/architecture.svg`).
**VO:** "Three layers — Compass Rose builds aligned skills, GM Louis reasons, BlackBox IQ governs and records. Competence is developed the way a researcher builds theory: constant comparison over the agent's own decisions, with fit and work as the gate. Microsoft governs permissions and grounding. We govern the layer no one else does — memory and competence, in 100% inspectable plain text."
**SCREEN:** end card — repo URL + "Agents propose, humans promote."

---

## Capture notes
- Record in **segments**; retry beats that hit a platform 429/500.
- Work IQ is an LLM agent — if a query returns "no results," use the reliable phrasing: *"Summarize recent emails about vendor payment terms, net-60, Vandelay, and the AP review."*
- Keep Obsidian's graph view (not file tree) — it reads better; test beforehand.
- ≤ 5:00 hard cap; target ~4:30. Solely your own work, no third-party music/stock.
