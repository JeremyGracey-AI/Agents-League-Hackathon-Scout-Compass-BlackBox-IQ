# Storyboard + v0 build kit — Compass-BlackBox IQ

An 8-panel animated explainer you can build in **[v0.dev](https://v0.dev)**, screen-record for the
submission video, and (later) ship as the project's permanent landing page. The 8 panels map
**1:1** to the deck (`slide-01…08`) and to the recording-script beats, so visuals stay continuous.

**Stack v0 will generate:** Next.js (App Router) · TypeScript · Tailwind · framer-motion · inline SVG.
No backend — every "live" number/citation is hard-coded from the real demo so it records clean.

---

## How to drive v0 (do this in order)

1. **Paste PROMPT 0 (design system)** first, in a fresh v0 chat. This sets the theme + motion tokens
   so every later panel inherits them. Don't skip it.
2. Then either:
   - **One-shot:** paste the **MASTER PROMPT** to scaffold all 8 panels at once (fast, rougher), or
   - **Panel-by-panel (recommended):** paste PROMPT 1, accept, then "add the next section:" + PROMPT 2,
     and so on. v0 produces noticeably better animation when it builds one section at a time.
3. After the panels exist, paste **PROMPT 9 (present mode)** to add autoplay + keyboard stepping for
   recording.
4. Refine with one-liners ("slow the trace loop to 2.4s", "make the vault glow on enter").

**Two delivery modes, same components:**
- **Scroll-snap** (default) — each panel is a full-viewport section, animates on scroll-into-view.
  Doubles as the live site for the permanent URL.
- **Present mode** (PROMPT 9) — autoplays panel→panel on a timer with ←/→ + space controls. This is
  what you screen-record.

---

## PROMPT 0 — design system (paste first)

```
Build a Next.js (App Router, TypeScript, Tailwind) single-page animated explainer called
"Compass-BlackBox IQ". Dark, premium, technical — think a developer-tool launch page.
Use framer-motion for all animation. Set up a shared theme now; I'll add panels next.

THEME (use CSS variables in globals.css + Tailwind arbitrary values):
  --bg-0:#0a0e1a  page base
  --bg-1:#0d1424  section base
  --bg-2:#101a2e  cards / pills
  --glow:#16224a  a soft radial glow anchored top-right of each section
  --ink:#e8ebf0   primary text
  --ink-dim:#9aa3b2   secondary text
  --ink-mute:#5d6c8d  labels / captions
  --line:#26324f  hairlines / borders
  FACTS  (Foundry IQ): #4f8cff  tint #93c5fd
  ACTIVITY (Work IQ):  #16c2a3  tint #5eead4
  MEANING (Fabric IQ): #9871f0  tint #c4b5fd
  VAULT  (governed):   #f59e0b  tint #fcd34d  fill #1c1407
Fonts: Inter (or system UI) for text; ui-monospace for code/citation chips.

MOTION TOKENS (reuse everywhere):
  ease = cubic-bezier(0.22, 1, 0.36, 1)
  section enter: opacity 0→1, y 24→0, 0.6s, staggerChildren 0.10
  use whileInView="show" with viewport={{ once:false, amount:0.45 }}
  trace draw: motion.path pathLength 0→1 over 1.2s on enter
  flowing dot: an SVG circle traveling its path via <animateMotion dur="2.4s" repeatCount="indefinite">
  pulse: scale 1→1.06→1, opacity loop, 2.2s ease-in-out infinite
  reduce-motion: respect prefers-reduced-motion (swap loops for static).

LAYOUT: full-viewport <section> panels, scroll-snap-y mandatory, a tiny fixed top-right progress
rail (8 dots, active = current panel). Reusable bits: <Pill>, <Chip mono>, <NodeDot color>,
<TraceSVG>, <Badge variant="live|roadmap">. Generate just the shell + theme + one empty section
placeholder for now.
```

---

## Storyboard at a glance

| # | Panel | Maps to | Beat (video) | One-line job |
|---|-------|---------|--------------|--------------|
| 1 | **Title / Hook** | slide-01 | 0:00 | Name + thesis: govern *memory & competence* |
| 2 | **The gap** | slide-02 | 0:00 hook | Microsoft governs "allowed"; the dark layer is what it *knows/did/learned* |
| 3 | **F.A.M. grounding** | slide-03 / banner | 1:55 | 3 lenses triangulate at the seam → the governed vault |
| 4 | **Real, not faked** | slide-04 | 1:55 | 4 panels light up; LIVE vs ROADMAP, honestly labeled |
| 5 | **The governed loop** | slide-05 | 0:25 | plan→…→approve ring; *agents propose, humans promote* |
| 6 | **The engine** | slide-06 | 3:55 | competence = constant comparative analysis (grounded theory) |
| 7 | **Safety & the blackbox** | — | 3:10 | append-only; behavior revertible, history not; auth-gated |
| 8 | **Platform / Close** | slide-07/08 | 3:55 | 3 products + "Agents propose, humans promote." + repo |

---

## PANEL 1 — Title / Hook

**Job:** brand + thesis in one breath.

```
┌──────────────────────────────────────────────┐
│                                              ·│
│      ◈ compass-logo                           │
│      Compass-BlackBox IQ                       │
│      The governance layer for an agent's       │
│      memory & competence.                      │
│      [3 Microsoft IQ surfaces][governed loop]  │
│      [human-gated]                             │
└──────────────────────────────────────────────┘
```

**Copy (exact):**
- H1: `Compass-BlackBox IQ`
- Sub: `The governance layer for an autonomous agent's ` + **bold** `memory & competence` + `.`
- Caption: `Grounded on Microsoft's F.A.M. intelligence layer · owned by the human · in plain text.`
- Pills: `3 Microsoft IQ surfaces` · `governed loop` · `human-gated`

**Motion:** logo scales-in + 1 slow rotation (0→6°, settle); H1 letters/words fade-up stagger;
"memory & competence" gets an amber underline that wipes L→R; pills pop in last (stagger 0.08).
Background radial glow breathes slowly.

```
Add PANEL 1 "Title". Centered-left hero on --bg-0 with the top-right radial --glow.
Left: a 96px rounded square placeholder logo (I'll swap /public/compass-logo.png) that scale-springs
in (0.6→1) and does ONE slow 6° settle-rotate. Right of it nothing — keep it a left-aligned column.
H1 "Compass-BlackBox IQ" 64px/750 --ink, words fade-up staggered 0.06.
Sub 26px --ink-dim: "The governance layer for an autonomous agent's <b style=--ink>memory & competence</b>."
Under "memory & competence" animate a 3px --vault underline that scaleX 0→1 (origin left, delay 0.5s).
Caption 16px --ink-mute: "Grounded on Microsoft's F.A.M. intelligence layer · owned by the human · in plain text."
Three <Pill>: "3 Microsoft IQ surfaces" (--activity text), "governed loop", "human-gated" — pop in last,
stagger 0.08, slight y-spring. Whole section uses the standard enter + whileInView.
```

---

## PANEL 2 — The gap

**Job:** the wedge. Microsoft governs *allowed*; the missing layer is *known / did / learned*.

```
┌──────────────────────────────────────────────┐
│  Microsoft governs what an agent is ALLOWED.   │
│   ▸ identity   ▸ permissions   ▸ grounding     │  ← three lit bars
│  ───────────────────────────────────────────  │
│   ▸ what it KNOWS · DID · LEARNED      [ ? ]    │  ← dark bar, then lights amber
│            ↳ Compass-BlackBox IQ               │
└──────────────────────────────────────────────┘
```

**Copy:**
- Eyebrow: `THE GAP`
- Line: `Microsoft governs what an autonomous agent is ` + **allowed** ` to do.`
- Lit row (3 chips): `identity` · `permissions` · `grounding` (each a calm blue/teal/purple)
- Dark row: `what it knows · what it did · what it learned` with a `?` → resolves to
  **`Compass-BlackBox IQ`** in amber.
- Kicker: `Buried in vendor memory you can't read, diff, or revoke. We make it plain text.`

**Motion:** the three "allowed" bars slide in lit and steady. A divider draws. The 4th bar sits dark
with a flickering `?`; on scroll it flips to amber, the `?` morphs to the product name, a subtle
"unlock" glow pulses once.

```
Add PANEL 2 "The gap". Eyebrow chip "THE GAP" (--ink-mute, mono, letter-spaced).
Headline 40px: 'Microsoft governs what an autonomous agent is <span --vault>allowed</span> to do.'
Row A: three horizontal "layer bars" (rounded, --bg-2, left color rail) labeled identity / permissions /
grounding in --facts/--activity/--meaning. They slide in from left, lit, stagger 0.12.
A hairline divider draws L→R (scaleX).
Row B: one wider dark bar labeled "what it KNOWS · DID · LEARNED" with a pulsing "?" on the right.
On whileInView, after 0.6s: the bar's rail + border animate to --vault, the "?" cross-fades into a
mono label "Compass-BlackBox IQ", and a one-shot box-shadow glow (amber) pulses.
Kicker 15px --ink-dim: "Buried in vendor memory you can't read, diff, or revoke. We make it plain text."
```

---

## PANEL 3 — F.A.M. grounding (the hero motif)

**Job:** the banner, alive. Facts/Activity/Meaning traces triangulate at the **seam**, never crossing
into the **governed vault**.

```
        Facts  ◯─────╮
       Foundry IQ     ╲
        Activity ◯────●····│ seam ····  ╭──────────╮
        Work IQ       ╱  (never merged)  │ ▣ vault  │
        Meaning ◯────╯                   ╰──────────╯
        Fabric IQ                  grounding is rented · memory is owned
```

**Copy:**
- Eyebrow: `F.A.M. — Microsoft's intelligence layer`
- Nodes: `Facts` /`Foundry IQ` · `Activity` /`Work IQ` · `Meaning` /`Fabric IQ`
- Seam label: `SEAM · never merged`
- Vault label: `governed vault` / `git · human-gated · revertible`
- Footer line: `grounding is rented · memory is owned`

**Motion:** three nodes fade in (blue/teal/purple). Each draws a trace (pathLength 0→1) that converges
on a single node sitting **on** the dashed seam; a colored dot flows along each trace continuously
(`<animateMotion>`). The vault door (PROMPT below) sits right of the seam and gives one amber glow when
the traces land. Footer line types/fades in.

```
Add PANEL 3 "F.A.M. grounding" — port the banner motif to live SVG (viewBox 0 0 600 360, centered).
Eyebrow "F.A.M. — Microsoft's intelligence layer".
Three node groups on the left, vertically spaced: each = an 11r ring (stroke --facts/--activity/--meaning,
fill --bg-0) + right-aligned label (bold tint color) + sub-label (--ink-mute): Facts/Foundry IQ,
Activity/Work IQ, Meaning/Fabric IQ.
From each node a motion.path curves right and CONVERGES on one shared node that sits exactly on a
vertical DASHED seam line. pathLength 0→1 on enter (1.2s, stagger 0.15). Along each path put a small
colored <circle r=3> that travels the path forever via <animateMotion dur="2.4s" repeatCount="indefinite">.
Seam: dashed --line vertical, top label (mono, --ink-mute, right-anchored) "SEAM · never merged".
Right of the seam render the VAULT DOOR (see vault spec) with label "governed vault" and
"git · human-gated · revertible" (--vault tints). When traces finish, pulse one amber glow on the vault.
Footer, centered under everything, 13px --ink-mute: "grounding is rented · memory is owned" (fade-up).

VAULT DOOR component (reuse in panels 3,7,8): 84px rounded square, fill --bg fill #1c1407, stroke --vault 2px;
inside a 30r circle (door) + faint 22r inner ring (opacity .45); a 6-spoke wheel (3 crossing lines) +
a 6.5r amber hub; four 2.5r amber bolts near the inner corners. On enter the spokes can rotate 0→ -12°
and settle (like turning a lock).
```

---

## PANEL 4 — Real, not faked

**Job:** prove it. Four grounding panels light up; honest **LIVE** vs **ROADMAP** badges.

```
┌── Foundry IQ · Facts ──┐ ┌── Work IQ · Activity ──┐
│ vendor master  [LIVE]  │ │ net-60 emails  [LIVE]  │
│ Initech · net-60 · …   │ │ AP review · Vandelay   │
└────────────────────────┘ └────────────────────────┘
┌── Fabric IQ · Meaning ─┐ ┌── Vault · governed ────┐
│ net-60→TermDeviation   │ │ kn-payment-policy      │
│ requiresApproval [RDMP] │ │ skill-vendor-triage    │
└────────────────────────┘ └────────────────────────┘
```

**Copy (real artifacts from the demo):**
- Foundry IQ · **Facts** — `vendor master` · `Initech · net-60 · approval contact` — `LIVE` (Azure AI Search)
- Work IQ · **Activity** — `recent emails: net-60, Vandelay, the AP review` — `LIVE` (M365 Copilot)
- Fabric IQ · **Meaning** — `net-60 → TermDeviation → requiresApproval` — `ROADMAP` (authored ontology)
- Vault · **governed memory** — `kn-payment-policy` · `skill-vendor-triage` — owned by the human
- Strap: `Read-only. Source-tagged. Never merged. Nothing here is faked — every claim has a live artifact.`

**Motion:** 2×2 grid; cards flip/scale-in stagger; a scan-line sweeps each card as its rows type in;
badges stamp in (spring) — green-ish LIVE, amber ROADMAP. Vault card has the amber rail.

```
Add PANEL 4 "Real, not faked". Eyebrow "ONE TASK, FOUR LENSES".
2×2 grid of cards (--bg-1, --line border, left color rail per lens). Each card: header row = lens name
+ <Badge>. Body = 2–3 mono <Chip> rows that type/fade in.
Card 1 Foundry IQ · Facts (--facts): chips "vendor master", "Initech · net-60 · approval contact" — Badge LIVE.
Card 2 Work IQ · Activity (--activity): chips "emails: net-60, Vandelay", "the AP review" — Badge LIVE.
Card 3 Fabric IQ · Meaning (--meaning): chips "net-60 → TermDeviation", "requiresApproval" — Badge ROADMAP.
Card 4 Vault · governed (--vault): chips "kn-payment-policy", "skill-vendor-triage" — no badge, amber rail.
Cards scale/opacity-in stagger 0.12; on enter a thin highlight scan-line sweeps top→bottom once.
Badge LIVE = teal pill w/ a tiny pulsing dot; ROADMAP = amber outline pill.
Footer strap 14px --ink-dim: "Read-only · source-tagged · never merged — nothing here is faked."
```

---

## PANEL 5 — The governed loop

**Job:** the reasoning cycle, with the human gate as the hinge.

```
        plan → recall → ground → act → log
                                        ↓
   re-run ← approve ⟂ propose ← audit ←─┘
              ▲ HUMAN GATE
        "Agents propose; humans promote."
```

**Copy:**
- Eyebrow: `THE GOVERNED LOOP`
- Steps (in order): `plan` → `recall` → `ground` → `act` → `log` → `audit` → `propose` → `approve` → `re-run`
- Gate callout on `approve`: `HUMAN GATE`
- Strap (big): `Agents propose; humans promote.`
- Sub: `The only write paths are decision records and proposals. Promotion is human-gated.`

**Motion:** lay the 9 steps around a horseshoe/ring. A glowing pulse travels the path node→node. At
`propose→approve` the pulse **stops** and waits; a green check stamps on `approve` (the human gate),
then the pulse continues to `re-run`. The `approve` node has an amber ring. Loop the whole cycle.

```
Add PANEL 5 "The governed loop". Eyebrow "THE GOVERNED LOOP".
Lay 9 step-nodes along a smooth open ring (SVG path): plan, recall, ground, act, log, audit, propose,
approve, re-run. Each node = small pill with mono label, connected by the ring path.
A bright pulse-dot travels the ring (animateMotion or a framer keyframe on offsetDistance) and lights
each node as it passes (node scales 1→1.08 + glows in its phase color: plan/recall/ground = blue,
act/log = teal, audit/propose = purple, approve = AMBER, re-run = blue).
KEY BEAT: when the pulse reaches "propose"→"approve" it PAUSES ~0.8s; a green check ✓ stamps onto the
"approve" node (which wears an amber ring labeled "HUMAN GATE"); then the pulse resumes to "re-run" and
the cycle loops.
Center strap 34px/700 --ink: "Agents propose; humans promote."
Sub 15px --ink-dim: "The only write paths are decision records and proposals — promotion is human-gated."
```

---

## PANEL 6 — The engine

**Job:** competence isn't vibes — it's grounded theory's **constant comparative analysis**.

```
 log_decision   →  initial coding
 run_audit      →  constant comparison
 the proposal   →  the memo
 human gate     →  fit & work (acceptance tests)
 promotion      →  theoretical saturation
```

**Copy:**
- Eyebrow: `THE ENGINE — competence as method`
- Five mapping rows (tool → grounded-theory term), exactly as above.
- Strap: `Skill quality is developed like a researcher builds theory — by constant comparison over the agent's own decisions.`
- Footnote: `Glaser & Strauss, 1967.`

**Motion:** two columns. Left = our tool calls (mono chips), right = the grounded-theory term. A
connector line draws between each pair on enter (stagger). The right column words fade up. On the
`human gate → fit & work` row, the two terms "fit" and "work" briefly highlight amber.

```
Add PANEL 6 "The engine". Eyebrow "THE ENGINE — competence as method".
A 5-row two-column map. Left col = mono <Chip> (--bg-2): log_decision, run_audit, the proposal,
human gate, promotion. Right col = --ink term: "initial coding", "constant comparison", "the memo",
"fit & work · acceptance tests", "theoretical saturation". Between each pair draw a connector line
(motion.line pathLength 0→1) with an arrowhead, staggered 0.12 on enter; right terms fade-up.
On the "human gate" row, wrap "fit & work" in --vault and give it a one-shot glow.
Strap 22px --ink: "Competence is developed the way a researcher builds theory — constant comparison
over the agent's own decisions." Footnote 12px --ink-mute: "Grounded theory · Glaser & Strauss, 1967."
```

---

## PANEL 7 — Safety & the blackbox

**Job:** the guarantees. Append-only; behavior revertible, history not; tool-layer invariant; auth-gated.

```
   ┌─ blackbox (append-only) ─┐
   │ dec-003  [blackbox]      │
   │ dec-004  [blackbox]      │   git revert skill ✓
   │ dec-005  [blackbox]   ⟲✗ │   git revert history ✗ (refused)
   └──────────────────────────┘
   behavior is revertible · history is not
```

**Copy:**
- Eyebrow: `SAFETY, IN THE TOOL LAYER`
- Stack of commit rows: `dec-003 [blackbox]`, `dec-004 [blackbox]`, `dec-005 [blackbox]`
- Two outcomes: `git revert <skill>` → **allowed** ✓ · `git revert <blackbox>` → **refused** ✗
- Strap: `Behavior is revertible. History is not.`
- Sub chips: `invariant enforced in the tool layer, not the prompt` · `MCP endpoint auth-gated` ·
  `empty citations are a designed signal, never patched`

**Motion:** decision rows stack upward (append feel), newest slides in on top. A "revert" command tries
to strike through a blackbox row → the row **shakes**, a red ✗ stamps, an amber tooltip
`history is not revertible` pops. The skill-revert shows a clean green ✓. Strap lands hard.

```
Add PANEL 7 "Safety & the blackbox". Eyebrow "SAFETY, IN THE TOOL LAYER".
Left: a terminal-style card (--bg-0, mono) where 3 rows append upward, newest spring-sliding in on top:
"[blackbox] dec-003 …", "dec-004", "dec-005 (needs_human, 3 citations)".
Right: two attempt rows. (a) "$ git revert <skill>" → green ✓ "rolled back". (b) "$ git revert <blackbox>"
→ the targeted row SHAKES (x keyframes), a red ✗ stamps, amber callout "history is not revertible — append-only".
Center strap 34px/700: "Behavior is revertible. History is not."
Three small --ink-mute chips below: "invariant in the tool layer, not the prompt", "MCP endpoint auth-gated",
"empty citations are a designed signal — never patched".
```

---

## PANEL 8 — Platform / Close

**Job:** three products + the mantra + the repo.

```
   ◐ Compass Rose      ◑ GM Louis        ▣ BlackBox IQ
   builds aligned      reasons over       governs &
   skills              the loop           records
   ───────────────────────────────────────────────
        "Agents propose, humans promote."
        github.com/JeremyGracey-AI/Agents-League-Hackathon-Compass-BlackBox-IQ
```

**Copy:**
- Eyebrow: `ONE PLATFORM, THREE LAYERS`
- Cards: `Compass Rose` /`builds role-aligned skills` · `GM Louis` /`reasons over the governed loop` ·
  `BlackBox IQ` /`governs & records — memory + competence`
- Closing strap: `Microsoft governs permissions & grounding. We govern the layer no one else does.`
- End card: **`Agents propose, humans promote.`** + repo URL + small `Agents League · Reasoning Agents`.

**Motion:** three product cards rise in (stagger), each with its glyph (compass / brain-or-GM badge /
vault door). Then everything dims and the end card resolves center: the mantra fades up, the repo URL
underlines L→R, the logo does a final gentle settle. Optionally loop back to Panel 1.

```
Add PANEL 8 "Platform / Close". Eyebrow "ONE PLATFORM, THREE LAYERS".
Three cards rise-in stagger 0.12: 1) "Compass Rose" glyph=compass rose, "builds role-aligned skills"
(--facts rail). 2) "GM Louis" glyph=monogram badge, "reasons over the governed loop" (--activity rail).
3) "BlackBox IQ" glyph=the VAULT DOOR component, "governs & records — memory + competence" (--vault rail).
Then a closing block: strap 24px --ink-dim "Microsoft governs permissions & grounding. We govern the
layer no one else does." END CARD center: H2 44px/750 "Agents propose, humans promote."; a mono link
"github.com/JeremyGracey-AI/Agents-League-Hackathon-Compass-BlackBox-IQ" with a --vault underline that
wipes in; tiny --ink-mute "Agents League @ AI Skills Fest 2026 · Reasoning Agents". Gentle logo settle.
```

---

## PROMPT 9 — present mode (for recording)

```
Add a "present mode". A fixed bottom-center control bar (auto-hides after 2s idle): ◀ ❙❙/▶ ▶.
Space = play/pause, ← / → = prev/next panel, F = fullscreen. In play mode auto-advance through the 8
panels on a timeline (Panel 1:4s, 2:7s, 3:9s, 4:8s, 5:9s, 6:7s, 7:7s, 8:8s ≈ 59s loop) by smooth-
scrolling each section into view and letting its whileInView animations fire. Respect
prefers-reduced-motion. Add ?present=1 to start in present mode + autoplay (so I can record straight to it).
Keep scroll-snap working when not presenting.
```

---

## Build / recording notes

- **Assets:** drop `compass-logo.png` (from `docs/submission/`) into `/public`. The vault door, nodes,
  traces, loop ring are all inline SVG — no image deps.
- **Fidelity to the demo:** every "live" string above is a real artifact (Initech net-60, Vandelay, the
  AP review, `kn-payment-policy`, `skill-vendor-triage`, `[blackbox] dec-00x`). Keep them — it's what makes
  "nothing is faked" land.
- **Honesty badge:** Fabric IQ must stay **ROADMAP** (amber), Foundry/Work **LIVE**. Don't let v0 "upgrade" it.
- **Recording:** open `?present=1` fullscreen at 1920×1080, record the ~59s loop, then cut under your VO.
  Panels 3–5 are the strongest stills if you need thumbnails.
- **Palette source of truth:** matches `docs/submission/banner.svg` and `compass-rose/web` exactly, so
  the v0 page, the deck, and the live dashboards all read as one product.
- **Permanent URL:** this same v0 project (scroll-snap mode, drop present mode's autoplay) is a great
  candidate for the public landing page when you stand up **B**.
```
