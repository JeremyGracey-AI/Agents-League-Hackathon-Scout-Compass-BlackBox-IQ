import Link from "next/link"
import { PageHeader, Card, SectionLabel, Badge, Mono } from "@/components/ui-kit"
import { mcpTools } from "@/lib/mock-data"
import { Hammer, Activity, ShieldCheck, ArrowRight, GitCommitVertical, Lock, Layers } from "lucide-react"

const surfaces = [
  {
    href: "/forge",
    icon: Hammer,
    name: "Skill Forge",
    sub: "Compass Rose",
    accent: "facts" as const,
    desc: "Build a role-aligned executive persona, pick from eight workflow archetypes, preview the generated SKILL.md, and install — no YAML.",
    stat: "8 archetypes · 3 personas",
  },
  {
    href: "/trace",
    icon: Activity,
    name: "Reasoning Trace",
    sub: "GM Louis",
    accent: "activity" as const,
    desc: "One task, four surfaces. Watch the agent ground across F.A.M. — Facts, Activity, Meaning — and recall its governed vault. Two lanes, never merged.",
    stat: "4 grounding lenses",
  },
  {
    href: "/vault",
    icon: ShieldCheck,
    name: "Vault & Audit",
    sub: "BlackBox IQ",
    accent: "vault" as const,
    desc: "Immutable decision records, the git log as audit trail, and proposals waiting at the human gate. Agents propose; humans promote.",
    stat: "4 decisions · 2 proposals",
  },
]

const layers = [
  { layer: "Permissions & security", governs: "Identity, policy, who/what an agent may touch", who: "Agent 365", owned: false },
  { layer: "Actions", governs: "Approve / block / pause per action, spend, tools", who: "Orchestration platforms", owned: false },
  { layer: "Memory & competence", governs: "What it knows, did, and learned — and who approved it", who: "Compass-BlackBox IQ", owned: true },
]

export default function OverviewPage() {
  return (
    <>
      <PageHeader
        eyebrow="The governance layer no one else owns"
        title="Make an agent's competence auditable, attributable, and revertible"
        description="Microsoft governs an agent's permissions, actions, and grounding. Compass-BlackBox IQ governs the layer no one else does: memory and competence — in 100% inspectable plain text, under git."
      >
        <Link
          href="/trace"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          See the loop <ArrowRight className="h-4 w-4" />
        </Link>
      </PageHeader>

      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">
        {/* Three surfaces */}
        <SectionLabel>One monorepo · three layers</SectionLabel>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {surfaces.map((s) => {
            const Icon = s.icon
            return (
              <Link key={s.href} href={s.href} className="group">
                <Card className="flex h-full flex-col p-5 transition-colors hover:border-muted-foreground/40">
                  <div className="flex items-center gap-3">
                    <div
                      className="grid h-10 w-10 place-items-center rounded-lg ring-1"
                      style={{
                        backgroundColor: `color-mix(in oklch, var(--${s.accent}) 14%, transparent)`,
                        color: `var(--${s.accent})`,
                        boxShadow: "inset 0 0 0 1px color-mix(in oklch, var(--" + s.accent + ") 30%, transparent)",
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold tracking-tight">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.sub}</p>
                    </div>
                  </div>
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <Mono className="text-muted-foreground">{s.stat}</Mono>
                    <span className="inline-flex items-center gap-1 text-sm text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Open <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* The loop */}
        <SectionLabel className="mt-12">The governed-memory loop</SectionLabel>
        <Card className="mt-5 p-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-3 text-sm">
            {[
              "Task arrives",
              "recall_knowledge",
              "act with judgment",
              "log_decision",
              "run_audit",
              "draft proposal",
              "human gate",
              "skill promoted",
            ].map((step, i, arr) => (
              <span key={step} className="flex items-center gap-2">
                <span
                  className={
                    i === 6
                      ? "rounded-md bg-human/12 px-2.5 py-1 font-mono text-[12px] text-human ring-1 ring-inset ring-human/25"
                      : "rounded-md bg-muted px-2.5 py-1 font-mono text-[12px] text-foreground/90"
                  }
                >
                  {step}
                </span>
                {i < arr.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
            Every action produces an immutable decision record. The audit mines those records: an
            uncited decision (the agent freelanced) becomes a draft skill proposal that cites the
            exact notes it overlooked. A human approves or rejects. The git log <em>is</em> the audit
            trail.
          </p>
        </Card>

        {/* Layers table */}
        <SectionLabel className="mt-12">Where governed memory matters</SectionLabel>
        <Card className="mt-5 overflow-hidden">
          <div className="grid grid-cols-[1.2fr_2fr_1.4fr] gap-px bg-border text-sm">
            <div className="bg-panel-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Layer</div>
            <div className="bg-panel-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Governs</div>
            <div className="bg-panel-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Who</div>
            {layers.map((l) => (
              <Row key={l.layer} l={l} />
            ))}
          </div>
        </Card>

        {/* Invariant + MCP tools */}
        <div className="mt-12 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-vault" />
              <h3 className="font-semibold">The invariant</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Enforced by the server, not the prompt. The agent's only write paths are{" "}
              <Mono className="text-foreground/90">decision records</Mono> and{" "}
              <Mono className="text-foreground/90">proposals</Mono>. Promotion into active
              skills/knowledge happens only through the human-gated{" "}
              <Mono className="text-foreground/90">approve_proposal</Mono>.
            </p>
            <div className="mt-4 flex items-start gap-2 rounded-lg bg-muted/60 p-3 text-sm">
              <GitCommitVertical className="mt-0.5 h-4 w-4 flex-none text-vault" />
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Behavior is revertible; history is not.</span>{" "}
                <Mono>revert_memory</Mono> rolls back a <Mono>[compass]</Mono>/<Mono>[human]</Mono>{" "}
                commit but refuses <Mono>[blackbox]</Mono> — the flight recorder is append-only.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              <h3 className="font-semibold">MCP tool surface</h3>
              <Badge className="ml-auto">{mcpTools.length} tools</Badge>
            </div>
            <ul className="mt-3 divide-y divide-border">
              {mcpTools.slice(0, 6).map((t) => (
                <li key={t.name} className="flex items-center gap-3 py-2">
                  <Mono className="text-foreground/90">{t.name}</Mono>
                  <Badge
                    tone={t.caller === "human gate" ? "human" : t.caller === "anyone" ? "neutral" : "facts"}
                    className="ml-auto"
                  >
                    {t.caller}
                  </Badge>
                </li>
              ))}
            </ul>
            <Link
              href="/vault"
              className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              See all tools at the human gate <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Card>
        </div>
      </div>
    </>
  )
}

function Row({ l }: { l: { layer: string; governs: string; who: string; owned: boolean } }) {
  return (
    <>
      <div className={`px-4 py-4 ${l.owned ? "bg-vault/[0.06]" : "bg-card"}`}>
        <span className={l.owned ? "font-semibold text-vault" : "font-medium"}>{l.layer}</span>
      </div>
      <div className={`px-4 py-4 text-muted-foreground ${l.owned ? "bg-vault/[0.06]" : "bg-card"}`}>{l.governs}</div>
      <div className={`px-4 py-4 ${l.owned ? "bg-vault/[0.06]" : "bg-card"}`}>
        {l.owned ? <Badge tone="vault">{l.who}</Badge> : <span className="text-muted-foreground">{l.who}</span>}
      </div>
    </>
  )
}
