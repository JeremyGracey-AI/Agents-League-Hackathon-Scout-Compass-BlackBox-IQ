# Video shot list — Compass-BlackBox IQ

Everything to produce the submission video in one place: each clip's **asset**, **Seedance
prompt**, and the **voice-over** that plays over it, in assembly order.

- **Length:** ~3:30–3:45 (under the 5:00 cap)
- **Aspect:** 16:9 · **Voice-over:** record your own, calm and confident (~145 wpm), pause between clips
- **Honesty guardrail:** only **Foundry IQ + Work IQ** are called *live*; **Fabric IQ** is named as the Meaning lens but never claimed live (authored roadmap)

## Seedance settings (per clip)
- **Model:** Seedance · **Reference → Video** · **16:9** · **8–10s** · **Audio: OFF** (you narrate over it)
- **Resolution:** draft at **480p** to lock the motion, re-run keepers at **1080p**
- Upload references from `~/Downloads/video-assets/` (cropped 16:9 slides) — they carry the current compass-vault brand image.

**BASE PROMPT** (prepend to every clip's motion line):
> Animate this graphic with subtle, premium motion-graphics: a slow gentle push-in, soft parallax on the dark background glow, faint drifting particles. **CRITICAL: keep every word of text, every number, and the layout perfectly sharp, legible, and unchanged — do not distort, warp, morph, or recolor any text or shapes.** Calm, cinematic, high-end. 16:9.

---

## Clip 1 — Cold open  ·  ~6s
**Generate from:** `thesis-card.png` — *static hold, no Seedance needed* (or a slow 5s push-in if you want motion).
**Voice-over:**
> Microsoft's stack governs what an autonomous agent is *allowed* to do — its identity, its permissions, its actions, what it's grounded on. But nobody governs what it **knows**, what it **did**, and how it **learns**. That layer is invisible — locked inside vendor memory you can't read, diff, or revoke. **Compass-BlackBox IQ is that missing layer.**

## Clip 2 — The gap  ·  ~15s
**Generate from:** `slide-02-problem.png`
**Seedance motion:** A soft light-sweep passes left-to-right; the bottom amber "memory & competence" row pulses with a warm glow.
**Voice-over:**
> Three layers govern an autonomous agent. The first two have a control plane — identity and permissions, approval gates and spend caps. The third — its **memory and its competence** — has nobody. That's the layer we built.

## Clip 3 — Governed memory  ·  ~25s
**Generate from:** `architecture.png`
**Seedance motion:** Slow gentle push-in; the three colored F.A.M. traces and the dashed seam line glow and pulse softly; the amber vault panel breathes. Everything stays sharp and readable.
**Voice-over:**
> Here's how. The agent's entire memory — its decisions, its skills, its knowledge — lives as plain Markdown in a Git repository **the human owns**. Every action becomes an immutable, cited decision record. The Git log *is* the audit trail. And the invariant is enforced in the tool layer, not the prompt: the agent can only ever write decisions and proposals. It can never touch its own active memory.

## Clip 4 — F.A.M. grounding  ·  ~25s
**Generate from:** `slide-03-fam.png`
**Seedance motion:** The three colored traces appear to flow from the compass and converge at the seam; the vault glows amber.
**Voice-over:**
> To reason, it grounds across Microsoft's intelligence layer — **F.A.M.**: Facts from Foundry IQ, Activity from Work IQ, and Meaning from Fabric IQ. Three lenses on the enterprise world, each earning its own citation. But grounding is **rented** and read-only — it's never merged into the memory the human owns. That seam is the whole thesis.

## Clip 5 — The loop + safety  ·  ~28s
**Generate from:** `slide-05-loop.png`
**Seedance motion:** A small bright pulse travels around the loop of steps; the amber "human gate" node glows brightest.
**Voice-over:**
> Then it gets better at its job. An audit mines the decision records and finds where the agent freelanced — where it acted without citing what it should have known. It drafts a new skill from the notes the agent overlooked, and a human approves it. **Agents propose; humans promote.**
> `git revert` rolls back a skill — but the blackbox is append-only. **Behavior is revertible; history is not.** And when the agent freelances, its citations come back honestly **empty** — a designed signal, never patched over.

## Clip 6 — The competence engine  ·  ~12s
**Generate from:** `slide-06-engine.png`
**Seedance motion:** The connector arrows between each left-column tool and its right-column term draw in one by one, left to right; the "fit + work" row glows amber.
**Voice-over:**
> We measure competence the way a researcher builds theory — constant comparison over the agent's own decisions, with *fit* and *work* as the test.

## Clip 7 — It runs  ·  ~15s
**Generate from:** `slide-04-real.png`
**Seedance motion:** The green LIVE badges and the amber ROADMAP badge pulse gently; a thin highlight scan-line sweeps top to bottom once.
**Voice-over:**
> And none of this is a concept. It runs. Foundry IQ and Work IQ ground **live** against real Microsoft endpoints. Every decision is a real, server-verified record. Nothing here is faked — every claim is backed by a live artifact you can open in the repo.

## Clip 8 — Three layers  ·  ~12s
**Generate from:** `slide-07-platform.png`
**Seedance motion:** The three layer cards light up in sequence top to bottom — blue, then teal, then amber rail glowing as each is named.
**Voice-over:**
> Three layers, one platform: **Compass Rose** builds the skills, **GM Louis** reasons, and **BlackBox IQ** governs and records.

## Clip 9 — Close  ·  ~12s
**Generate from:** `slide-08-close.png`
**Seedance motion:** Everything settles; the line "Agents propose, humans promote" glows softly, then a slow gentle fade.
**Voice-over:**
> Microsoft governs permissions and grounding. We govern the layer no one else does — an autonomous agent's **memory and competence**, in a hundred percent inspectable plain text. Agents propose. Humans promote.

---

## Assembly
- Order clips 1 → 9 with smooth crossfades. Hand me the rendered clips (drop in `~/Downloads/overview-clips/` named `01-…`, `02-…`) and I'll stitch + normalize with ffmpeg.
- Record the VO in one pass per clip; leave a half-beat of silence between blocks so transitions breathe.
- **Trim levers if long:** cut Clip 5's safety paragraph, or shorten Clip 4 to its first and last sentences.
