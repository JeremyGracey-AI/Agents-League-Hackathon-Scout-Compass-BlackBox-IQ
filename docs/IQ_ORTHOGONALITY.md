# IQ / Vault Orthogonality Rule

**Status:** Load-bearing — grounding must never merge into governed memory.

## The rule

GM Louis has one **governed-memory** recall tool and the **read-only grounding**
tools of F.A.M. Their results appear in separate, source-tagged lanes — never
merged, blended, re-ranked, or allowed to suppress each other.

| Tool | Surface | Lane / citation |
|------|---------|-----------------|
| `recall_knowledge` | the git vault — **governed memory** | `[vault: …]` |
| `ground_foundry_iq` | Foundry IQ — **Facts** (Azure AI Search KB) | `[iq: …]` |
| `ground_work_iq` | Work IQ — **Activity** (M365 Copilot Gateway) | `[work: …]` |
| `ground_fabric_iq` | Fabric IQ — **Meaning** (RDF/OWL ontology) | `[fabric: …]` |

Grounding (F.A.M.) is **rented**: read-only, source-tagged, never written into
the vault. The vault is **owned**: governed, human-gated, revertible. The seam
between them is the thesis.

## Why this is load-bearing

Grounding answers can resemble vault content. Two enforcement points keep them apart:

1. **Server (tool layer):** `server/src/ground.ts` is additive and isolated —
   grounding results are returned by their own tools and are **never merged** into
   `recall_knowledge`'s scored array. `server/src/tools.ts` (the vault) is
   untouched, so the promoted-skill ranking the demo depends on is unchanged.
2. **Agent contract:** `agent/gm-louis-instructions.md` requires each surface
   under its own labeled section with its own citation prefix, and forbids citing
   a grounding ref as a vault note in `log_decision`.

If either weakens, grounding could silently override governed memory — the one
thing this rule exists to prevent.

## Enforcement checklist (review on any grounding or agent-instruction change)

- [ ] Each grounding tool's results stay in their own `### From <surface>` section
- [ ] No grounding result is merged into `recall_knowledge`'s results array (`ground.ts` stays additive)
- [ ] No instruction tells GM Louis to "use whichever result is more relevant" across surfaces, or to deduplicate across them
- [ ] A grounding ref (`[iq:]` / `[work:]` / `[fabric:]`) is never cited as a vault note in `log_decision`
- [ ] `node demo/smoke-test.mjs` still passes after any server change (governed loop green)
