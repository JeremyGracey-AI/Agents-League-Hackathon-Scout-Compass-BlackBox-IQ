// Realistic mock data for the Compass-BlackBox IQ UI.
// Derived from the project's seed vault, personas, and MCP tool surface.

/* ------------------------------------------------------------------ */
/* Skill Forge — personas + workflow archetypes                        */
/* ------------------------------------------------------------------ */

export type Persona = {
  id: string
  displayName: string
  title: string
  org: string
  location: string
  charter: string
  priorities: string[]
  partnerOrgs: string[]
  signaturePhrases: string[]
  tone: string
}

export const personas: Persona[] = [
  {
    id: "morgan-reyes",
    displayName: "Morgan Reyes",
    title: "General Manager, Operations Enablement",
    org: "Contoso Ltd.",
    location: "Austin, Texas",
    charter:
      "Lead Operations Enablement — embed KPI-driven continuous improvement and AI to improve revenue velocity, operational quality, speed, and compliance at scale across quote-to-cash, product launch, and partner lifecycle.",
    priorities: [
      "Embed AI into operational and compliance workflows at scale",
      "KPI-driven continuous improvement",
      "Product management discipline for internal operations",
      "Data and reporting maturity",
      "Talent development and inclusive leadership",
    ],
    partnerOrgs: ["Sales", "Finance", "Operations", "Engineering", "Legal", "Risk", "Marketing"],
    signaturePhrases: [
      "KPI-driven continuous improvement",
      "revenue velocity, quality, speed, and compliance",
      "at scale",
      "embed AI",
      "quote-to-cash",
      "partner lifecycle",
    ],
    tone: "Executive, calm, KPI-anchored, partnership-oriented",
  },
  {
    id: "priya-nair",
    displayName: "Priya Nair",
    title: "VP, Customer Success",
    org: "Northwind Traders",
    location: "Seattle, Washington",
    charter:
      "Own net revenue retention and customer health across the enterprise book. Turn renewals and expansion into a predictable, instrumented motion partnered with Sales and Product.",
    priorities: [
      "Net revenue retention above target",
      "Reduce time-to-value for new accounts",
      "Executive sponsor coverage on top accounts",
      "Churn early-warning instrumentation",
    ],
    partnerOrgs: ["Sales", "Product", "Support", "Finance", "Marketing"],
    signaturePhrases: ["net revenue retention", "customer health", "time-to-value", "expansion motion"],
    tone: "Warm, outcome-driven, data-backed",
  },
  {
    id: "daniel-okafor",
    displayName: "Daniel Okafor",
    title: "Director, Platform Engineering",
    org: "Fabrikam Inc.",
    location: "Remote (GMT)",
    charter:
      "Run the internal developer platform — reliability, golden paths, and the paved road that lets product teams ship safely and fast.",
    priorities: [
      "Platform reliability and SLOs",
      "Golden-path adoption across teams",
      "Cost-to-serve per service",
      "Security and compliance by default",
    ],
    partnerOrgs: ["Product", "Security", "SRE", "Finance"],
    signaturePhrases: ["paved road", "golden path", "SLOs", "ship safely and fast"],
    tone: "Pragmatic, precise, reliability-first",
  },
]

export type Archetype = {
  id: string
  label: string
  blurb: string
  triggers: string[]
  recurring: boolean
  category: string
}

export const archetypes: Archetype[] = [
  {
    id: "briefing",
    label: "Briefing",
    blurb: "One-page exec brief — KPI table, who's in the room, talking points.",
    triggers: ["brief me on", "prep me for", "give me a pre-read on"],
    recurring: false,
    category: "Prep & brief",
  },
  {
    id: "meeting-prep",
    label: "Meeting Prep",
    blurb: "Run-of-show for a specific meeting — agenda, attendees, decisions to land.",
    triggers: ["prep me for my meeting with", "build an agenda for", "run of show for"],
    recurring: false,
    category: "Prep & brief",
  },
  {
    id: "one-on-one",
    label: "One-on-One",
    blurb: "1:1 prep card — since last time, follow-ups both ways, one growth note.",
    triggers: ["prep for my 1:1 with", "follow-ups from my last 1:1 with"],
    recurring: true,
    category: "Prep & brief",
  },
  {
    id: "comms",
    label: "Comms",
    blurb: "Audience-mode draft with three subject lines and risk flags.",
    triggers: ["draft", "reply to", "send a note to"],
    recurring: false,
    category: "Communicate",
  },
  {
    id: "triage",
    label: "Triage",
    blurb: "Daily/weekly digest — top-of-mind, compliance flags, KPI exceptions, delegations.",
    triggers: ["morning digest", "what needs me today", "triage my inbox"],
    recurring: true,
    category: "Operate",
  },
  {
    id: "decisions-log",
    label: "Decisions Log",
    blurb: "Durable decision record — the call, options, owner, follow-ups, review date.",
    triggers: ["log this decision", "record what we decided", "what did we decide about"],
    recurring: false,
    category: "Operate",
  },
  {
    id: "strategy",
    label: "Strategy",
    blurb: "Two-to-four page memo — recommendation, options table, sequencing, open questions.",
    triggers: ["analyze", "build the case for", "strategic view on"],
    recurring: false,
    category: "Decide & review",
  },
  {
    id: "review-prep",
    label: "Review Prep",
    blurb: "MBR/QBR pack — KPI scorecard, narrative, wins, risks with recovery owners.",
    triggers: ["prep my QBR", "build my monthly business review", "pull my KPI scorecard"],
    recurring: true,
    category: "Decide & review",
  },
]

export type Preset = {
  id: string
  label: string
  description: string
  workflows: string[]
}

export const presets: Preset[] = [
  {
    id: "daily",
    label: "Daily driver",
    description: "Everyday cockpit: triage, briefings, and 1:1 prep.",
    workflows: ["triage", "briefing", "one-on-one"],
  },
  {
    id: "meetings",
    label: "Meetings & decisions",
    description: "Walk in ready, walk out with the decision logged.",
    workflows: ["meeting-prep", "one-on-one", "decisions-log"],
  },
  {
    id: "review",
    label: "Leadership review",
    description: "Business reviews and the strategy + decisions behind them.",
    workflows: ["review-prep", "strategy", "decisions-log"],
  },
  {
    id: "all",
    label: "The works",
    description: "All eight archetypes.",
    workflows: archetypes.map((a) => a.id),
  },
]

// A realistic rendered SKILL.md preview for a given persona + archetype.
export function renderSkillPreview(persona: Persona, archetypeId: string): string {
  const a = archetypes.find((x) => x.id === archetypeId)
  if (!a) return ""
  const first = persona.displayName.split(" ")[0]
  const slug = `${persona.id.split("-")[0]}-${a.id}`
  return `---
name: ${slug}
description: >-
  ${a.blurb} Use when ${first} says "${a.triggers[0]}" or "${a.triggers[1] ?? a.triggers[0]}".
---

# ${a.label} — ${persona.displayName}

## When to use
Trigger this skill when ${first} (${persona.title}, ${persona.org}) asks for a
${a.label.toLowerCase()}. ${a.blurb}

## Procedure
1. Ground the request against ${first}'s charter and the relevant KPIs.
2. Pull the partner orgs in scope: ${persona.partnerOrgs.slice(0, 4).join(", ")}.
3. Frame the output in ${first}'s voice — "${persona.signaturePhrases[0]}".
4. Flag any compliance or control exposure explicitly (never omit).
5. Run the self-check before delivering.

## Self-check
- [ ] ${first} is named, not "the user".
- [ ] At least one KPI is referenced.
- [ ] Partner orgs named, not "the team".
- [ ] Compliance posture stated.
- [ ] No fabricated numbers or quotes.
`
}

/* ------------------------------------------------------------------ */
/* Reasoning Trace — F.A.M. grounding lenses + governed vault          */
/* ------------------------------------------------------------------ */

export const traceExamples = [
  "A vendor invoice from Vandelay requests net-60 terms — how should we handle it?",
  "Who is the COO?",
  "Summarize recent emails about vendor payment terms and the AP review.",
  "What are our standard payment terms?",
]

export type GroundingResult = {
  lens: "facts" | "activity" | "meaning" | "vault"
  title: string
  citation: string
  source: string
  latencyMs: number
  status: "live" | "roadmap"
  notes?: string[]
  body: string
}

// Keyed mock responses for the canonical demo query.
export const traceResponse: Record<string, GroundingResult> = {
  facts: {
    lens: "facts",
    title: "Foundry IQ",
    citation: "[iq:]",
    source: "vendor-master · payment-terms-handbook",
    latencyMs: 412,
    status: "live",
    notes: ["vendor-master", "payment-terms-handbook"],
    body: "Standard payment terms are net-30 for all vendors. Vendor 'Vandelay Industries' is not present in the vendor master — no contracted terms on file. Terms beyond net-30 are classified as a deviation in the finance handbook.",
  },
  activity: {
    lens: "activity",
    title: "Work IQ",
    citation: "[work:]",
    source: "M365 Copilot · mail + calendar",
    latencyMs: 690,
    status: "live",
    notes: ["3 related emails", "1 calendar hold"],
    body: "**Recent activity**\n- Email from ap@vandelay.example requesting net-60 on invoice #2207 (2 days ago).\n- Internal thread: Finance asked to confirm whether Vandelay is an approved vendor.\n- Calendar: 'AP terms review' hold on Thursday with the Finance ops lead.",
  },
  meaning: {
    lens: "meaning",
    title: "Fabric IQ",
    citation: "[fabric:]",
    source: "business ontology (RDF/OWL)",
    latencyMs: 0,
    status: "roadmap",
    notes: [],
    body: "PaymentTerm → classifiedAs → TermDeviation → requiresApproval. The modeled meaning behind a net-60 escalation. Ontology authored in foundry/knowledge-sources/fabric-iq; live wiring (Fabric Data Agent) is the documented next step.",
  },
  vault: {
    lens: "vault",
    title: "Vault — governed memory",
    citation: "[vault:]",
    source: "kn-payment-policy · skill-vendor-triage · kn-escalation-contacts",
    latencyMs: 38,
    status: "live",
    notes: ["kn-payment-policy", "skill-vendor-triage", "kn-escalation-contacts"],
    body: "**Payment terms policy** — Standard terms are net-30. Any request beyond net-30 is a deviation and requires human approval before any commitment. Route terms deviations and amounts over $5,000 to the finance operations lead via the needs_human outcome. Do not approve on the vendor's behalf.",
  },
}

/* ------------------------------------------------------------------ */
/* Vault & Audit — decisions, git log, proposals                       */
/* ------------------------------------------------------------------ */

export type Decision = {
  id: string
  agent: string
  task: string
  trigger: string
  outcome: "completed" | "needs_human" | "failed"
  confidence: number
  citations: string[]
  timestamp: string
  plan: string[]
}

export const decisions: Decision[] = [
  {
    id: "dec-004",
    agent: "gm-louis",
    task: "Vendor invoice from Vandelay requests net-60 terms",
    trigger: "event",
    outcome: "needs_human",
    confidence: 0.81,
    citations: ["skill-vendor-triage", "kn-payment-policy", "kn-escalation-contacts"],
    timestamp: "2026-06-13T16:42:00Z",
    plan: [
      "Recall vendor profile — Vandelay not found (unknown vendor)",
      "Verify terms: net-60 deviates from net-30 policy",
      "Route to needs_human per escalation contacts",
    ],
  },
  {
    id: "dec-003",
    agent: "gm-louis",
    task: "Answer pricing question from unknown vendor Vandelay Industries",
    trigger: "user_request",
    outcome: "completed",
    confidence: 0.5,
    citations: ["kn-escalation-contacts"],
    timestamp: "2026-06-11T15:30:00Z",
    plan: [
      "Recall vendor profile — none found (unknown vendor)",
      "Recall escalation guidance",
      "Draft a non-committal reply requesting contract details",
    ],
  },
  {
    id: "dec-002",
    agent: "gm-louis",
    task: "Renewal reminder for Globex Q3 contract",
    trigger: "schedule",
    outcome: "completed",
    confidence: 0.88,
    citations: ["kn-vendor-globex", "kn-escalation-contacts"],
    timestamp: "2026-06-10T22:10:00Z",
    plan: ["Recall vendor profile", "Draft internal reminder with renewal date"],
  },
  {
    id: "dec-001",
    agent: "gm-louis",
    task: "Triage invoice #1042 from Globex Ltd",
    trigger: "event",
    outcome: "completed",
    confidence: 0.92,
    citations: ["skill-vendor-triage", "kn-vendor-globex", "kn-payment-policy"],
    timestamp: "2026-06-09T18:00:00Z",
    plan: [
      "Recall vendor profile and payment policy",
      "Verify terms (net-30, $1,840 — within policy)",
      "Draft acknowledgement reply",
    ],
  },
]

export type Commit = {
  sha: string
  actor: "blackbox" | "compass" | "human" | "seed"
  message: string
  timestamp: string
}

export const auditLog: Commit[] = [
  { sha: "a1f9c20e", actor: "compass", message: "[compass] draft proposal prop-002 from uncited decision dec-003", timestamp: "2026-06-13T17:01:00Z" },
  { sha: "7d3b88f1", actor: "blackbox", message: "[blackbox] log decision dec-004 — Vandelay net-60 (needs_human)", timestamp: "2026-06-13T16:42:00Z" },
  { sha: "c0e51a9d", actor: "human", message: "[human] approve proposal prop-001 → skill-unknown-vendor-intake", timestamp: "2026-06-12T09:20:00Z" },
  { sha: "5b2af714", actor: "compass", message: "[compass] draft proposal prop-001 from uncited decision dec-003", timestamp: "2026-06-11T15:35:00Z" },
  { sha: "9e8c1d6a", actor: "blackbox", message: "[blackbox] log decision dec-003 — Vandelay pricing (completed, conf 0.5)", timestamp: "2026-06-11T15:30:00Z" },
  { sha: "3a7f0b22", actor: "blackbox", message: "[blackbox] log decision dec-002 — Globex renewal reminder", timestamp: "2026-06-10T22:10:00Z" },
  { sha: "11d4e9c8", actor: "blackbox", message: "[blackbox] log decision dec-001 — Globex invoice #1042", timestamp: "2026-06-09T18:00:00Z" },
  { sha: "00a1b2c3", actor: "seed", message: "[human] seed vault for demo", timestamp: "2026-06-09T12:00:00Z" },
]

export type Proposal = {
  id: string
  title: string
  rationale: string
  sourceDecision: string
  citesNotes: string[]
  status: "pending" | "approved" | "rejected"
}

export const proposals: Proposal[] = [
  {
    id: "prop-002",
    title: "Skill: Unknown-vendor intake checklist",
    rationale:
      "dec-003 was logged with a single citation and confidence 0.5 — the agent freelanced on an unknown vendor. This draft cites the escalation contacts and payment policy notes the agent should have consulted, derived from real vault content.",
    sourceDecision: "dec-003",
    citesNotes: ["kn-escalation-contacts", "kn-payment-policy"],
    status: "pending",
  },
  {
    id: "prop-003",
    title: "Knowledge: Vendor master gap — Vandelay Industries",
    rationale:
      "Two decisions referenced Vandelay with no vendor profile on file. Proposing a knowledge note so future triage can verify terms instead of escalating blind.",
    sourceDecision: "dec-004",
    citesNotes: ["kn-payment-policy"],
    status: "pending",
  },
]

export type VaultNote = {
  id: string
  type: "knowledge" | "skill"
  title: string
  status?: string
  citeCount: number
  lastCited: string | null
  tags: string[]
}

export const vaultNotes: VaultNote[] = [
  { id: "kn-payment-policy", type: "knowledge", title: "Payment terms policy", citeCount: 4, lastCited: "2026-06-13T16:42:00Z", tags: ["finance", "policy", "terms"] },
  { id: "kn-vendor-acme", type: "knowledge", title: "Vendor profile: Acme Corp", citeCount: 2, lastCited: "2026-06-10T22:10:00Z", tags: ["vendor", "acme"] },
  { id: "kn-vendor-globex", type: "knowledge", title: "Vendor profile: Globex Ltd", citeCount: 3, lastCited: "2026-06-10T22:10:00Z", tags: ["vendor", "globex"] },
  { id: "kn-escalation-contacts", type: "knowledge", title: "Escalation contacts", citeCount: 3, lastCited: "2026-06-13T16:42:00Z", tags: ["escalation", "approvals"] },
  { id: "skill-vendor-triage", type: "skill", title: "Vendor email triage", status: "active", citeCount: 3, lastCited: "2026-06-13T16:42:00Z", tags: ["vendor", "triage"] },
  { id: "skill-meeting-summary", type: "skill", title: "Meeting summary distribution", status: "active", citeCount: 0, lastCited: null, tags: ["meetings"] },
]

/* ------------------------------------------------------------------ */
/* Shared — MCP tool surface (for overview / reference)                */
/* ------------------------------------------------------------------ */

export type McpTool = {
  name: string
  caller: "agent" | "human gate" | "anyone"
  purpose: string
}

export const mcpTools: McpTool[] = [
  { name: "recall_knowledge", caller: "agent", purpose: "Keyword recall over knowledge + skills." },
  { name: "get_skill", caller: "agent", purpose: "Fetch a skill's full procedure." },
  { name: "log_decision", caller: "agent", purpose: "Write the blackbox record — the only agent write path." },
  { name: "run_audit", caller: "agent", purpose: "Three heuristics: uncited decisions, stale skills, low-confidence repeats." },
  { name: "list_proposals", caller: "agent", purpose: "Show drafts awaiting review." },
  { name: "approve_proposal", caller: "human gate", purpose: "Promote a proposal into active memory." },
  { name: "reject_proposal", caller: "human gate", purpose: "Delete a proposal with a reason." },
  { name: "revert_memory", caller: "human gate", purpose: "git revert a [compass]/[human] commit. Refuses [blackbox]." },
  { name: "memory_log", caller: "anyone", purpose: "The audit trail itself." },
  { name: "ground_foundry_iq", caller: "agent", purpose: "Read-only Facts grounding (Azure AI Search KB)." },
  { name: "ground_work_iq", caller: "agent", purpose: "Read-only Activity grounding (M365 Copilot)." },
]

export const lensMeta = {
  facts: { label: "Facts", color: "var(--facts)", tw: "text-facts", citation: "[iq:]" },
  activity: { label: "Activity", color: "var(--activity)", tw: "text-activity", citation: "[work:]" },
  meaning: { label: "Meaning", color: "var(--meaning)", tw: "text-meaning", citation: "[fabric:]" },
  vault: { label: "Owned", color: "var(--vault)", tw: "text-vault", citation: "[vault:]" },
} as const
