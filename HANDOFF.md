# HANDOFF.md — Compass-BlackBox IQ: full rebuild on Azure

**Audience:** Claude Code (desktop), continuing this build with Jeremy Gracey.
**Read this fully before touching code.** Repo:
`github.com/JeremyGracey-AI/Agents-League-Hackathon-Scout-Compass-BlackBox-IQ`.

---

## Mission

Stand up the complete **Compass-BlackBox IQ** platform on **Microsoft Azure**:

- **GM Louis** (agent + web app) deployed on Azure.
- **Foundry IQ** grounding — live (already wired).
- **Work IQ** simulated with **synthetic data** for a **fictional Microsoft General
  Manager persona** (no real person — see guardrails).
- All three retrieval surfaces kept **orthogonal** to the governed vault memory.

No deadline pressure — build it right.

## The platform (locked naming)

| Layer | Name | What | Where in repo |
|---|---|---|---|
| 1 | **Compass Rose** | skill direction & alignment (CLI + 8 exec archetypes) | `compass-rose/` |
| 1 (UI) | **GM Louis (web app)** | no-YAML persona → preview → install | `compass-rose/web/` |
| 2 | **GM Louis (agent)** | reasoning agent (Foundry); **Freelance GM** = ungoverned "before" | `agent/` |
| 3 | **BlackBox IQ (GGR)** | Governance · Grounding · Recorder — the MCP server + vault | `server/`, `demo/` |

Umbrella project: **Compass-BlackBox IQ** ("built for Microsoft Scout" — tagline
only; never imply official Microsoft affiliation). Commit actors
`[blackbox]`/`[compass]`/`[human]` are load-bearing — never rename.

## What already works — EXTEND, don't rebuild from scratch

- **GGR MCP server** (`server/`): 9 governed tools + `ground_foundry_iq` (10 total).
  `npm run build` + `node demo/seed-vault.mjs` + `node demo/smoke-test.mjs` are
  green. `ground.ts` already has additive, isolated, read-only backends for
  `ground_foundry_iq`, `ground_fabric_iq`, **`ground_work_iq`** (env-gated; see
  `SPECS` and the `WORK_IQ_*` env prefix).
- **Foundry IQ** is provisioned: Azure AI Search service `scout-compass-srch`
  (RG `rg-jg-3018`, West US 2), knowledge base `scout-compass-kb`, file source
  `ks-file-439` (vendor master / org directory / handbook in
  `foundry/knowledge-sources/`). Grounding verified live. The retrieve API uses
  `intents:[{type:"semantic",search}]` at minimal reasoning effort (see ground.ts).
- **Compass Rose** (`compass-rose/`): Python CLI (`cli/compass.py`), 8 Jinja2
  archetypes, `meta_skill/`, and the **GM Louis Flask web app** (`web/app.py`) —
  already **Vercel-ready** (`vercel.json` + `api/index.py`).

## Build goals

### 1. Deploy the GGR MCP server on Azure
Use `docs/deploy-container-apps.md` (Azure Container Apps from `server/Dockerfile`).
**Single replica** (`--min-replicas 1 --max-replicas 1` — the vault is per-container).
Set `FOUNDRY_IQ_*` (and `WORK_IQ_*`, below) as Container App **secrets**. Result:
a stable `https://<fqdn>/mcp` to replace the dev tunnel. Re-point the GM Louis
agent's MCP tool to it.

### 2. Deploy GM Louis (web app) on Azure
The Flask app in `compass-rose/web/` (Vercel-ready, but we want Azure for the
ecosystem story). Pick one:
- **Azure App Service** (Python/Flask, simplest), or
- **Azure Container Apps** (containerize the Flask app).
Rebrand the UI first: `web/templates/index.html` `<title>`/headers still say
"Scout Compass" → **GM Louis**. Public URL → put in the README + submission.

### 3. Foundry IQ grounding — confirm live in the deployed env
Already wired. Just ensure the deployed GGR server has `FOUNDRY_IQ_ENDPOINT`,
`FOUNDRY_IQ_KEY` (query key, read-only), `FOUNDRY_IQ_KB=scout-compass-kb`,
`FOUNDRY_IQ_KS=ks-file-439`, `FOUNDRY_IQ_KS_KIND=file`.

### 4. Work IQ — simulate with synthetic data + a fictional Microsoft GM persona
Work IQ (M365 org intelligence — emails, meetings, chats, docs) needs a real
tenant we don't have, so **simulate it**:
- Author **synthetic Work IQ data** for a **fictional Microsoft General Manager**
  in `foundry/knowledge-sources/work-iq/`: fake emails, meeting notes, an org
  directory, recent "decisions," 1:1 threads — the kind of organizational context
  Work IQ surfaces. Make it clearly demo data (e.g., a header noting it's
  synthetic). The persona is **fictional** — invent the name, reports, and org;
  do **not** model a real individual (see guardrails).
- Ingest it as a **second knowledge source** (`work-iq-ks`) — either a new source
  on `scout-compass-kb` or a dedicated KB. Then wire `ground_work_iq` via
  `WORK_IQ_KS=work-iq-ks` (it reuses `FOUNDRY_IQ_ENDPOINT/KEY` per `resolve()` in
  ground.ts; `WORK_IQ_KS_KIND` defaults to `workIQ` — override to `file` if it's a
  file source). Results come back tagged `source:work-iq` with `[work:]` citations.
- Net: GM Louis can answer "what did we decide in last week's review?" from Work IQ,
  separate from Foundry IQ (institutional facts) and the vault (governed memory).

### 5. Wire GM Louis (agent) in Foundry with all surfaces
The governed agent uses: the GGR MCP server (vault tools + `ground_foundry_iq` +
`ground_work_iq`) and, optionally, a native Foundry IQ knowledge attach. Keep
**Freelance GM** (ungoverned) for the "before" contrast. Instructions:
`agent/gm-louis-instructions.md` (governed) and `agent/freelance-gm-instructions.md`.

## Guardrails — DO NOT VIOLATE

1. **No real-person data, ever.** A real person was previously scrubbed from these
   repos; never reintroduce one. The Microsoft GM persona and all Work IQ data are
   **fictional/synthetic**. Run a secret + PII scan before any push.
2. **Memory-governance invariant** (enforced in `server/src/tools.ts`): the agent's
   only write paths are decisions and proposals; promotion is the human-gated
   `approve_proposal`; `revert_memory` refuses `[blackbox]` commits. Never weaken.
3. **Orthogonality** (`docs/IQ_ORTHOGONALITY.md`): Foundry IQ, Work IQ, Fabric IQ
   grounding are read-only and **never merged** into `recall_knowledge`'s scored
   results; each is source-tagged with its own citation prefix
   (`[iq:]`/`[work:]`/`[fabric:]`); never cited as a vault note in `log_decision`.
   `ground.ts` stays additive — `tools.ts` and `recall_knowledge` are untouched.
4. **Secrets** live in `.env` (gitignored) / Azure secrets — never committed. Use
   read-only **query keys** for search, not admin keys.
5. **After any server change**, re-run `node demo/seed-vault.mjs && node
   demo/smoke-test.mjs` — it exits non-zero on failure. Keep it green.
6. **No new npm deps** in the GGR server; IQ backends use raw `fetch`. Each new
   grounding backend degrades gracefully (registers only when its env is set).

## Verification / done

- GGR server live on Azure: `curl https://<fqdn>/healthz` ok; `tools/list` returns
  10–11 tools (9 governed + `ground_foundry_iq` + `ground_work_iq`).
- GM Louis web app live on Azure at a public URL, branded GM Louis.
- `ground_foundry_iq` returns institutional facts (`source:foundry-iq`);
  `ground_work_iq` returns the fictional GM's org context (`source:work-iq`); the
  two never merge with each other or with vault recall.
- Full governed loop still passes (smoke + a live agent run): freelance → audit (3
  findings) → human approve → governed re-run citing the promoted skill.
- README + `docs/architecture.svg` updated to the live Azure URLs and the Work IQ
  surface. No secrets, no real-person data anywhere in the repo or its history.

## References
See the footnotes in `README.md`: Build 2026, Foundry IQ, ASSERT, Agent Control
Specification, Omnigent.
