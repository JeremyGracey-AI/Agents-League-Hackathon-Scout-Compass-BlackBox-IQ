import { cn } from "@/lib/utils"

export function PageHeader({
  eyebrow,
  title,
  description,
  accent = "primary",
  children,
}: {
  eyebrow: string
  title: string
  description: string
  accent?: "primary" | "vault" | "facts" | "activity"
  children?: React.ReactNode
}) {
  const dot = {
    primary: "bg-primary",
    vault: "bg-vault",
    facts: "bg-facts",
    activity: "bg-activity",
  }[accent]
  return (
    <div className="border-b border-border">
      <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
              <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
              {eyebrow}
            </div>
            <h1 className="mt-3 text-pretty text-2xl font-semibold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">{description}</p>
          </div>
          {children && <div className="flex flex-none flex-wrap items-center gap-2">{children}</div>}
        </div>
      </div>
    </div>
  )
}

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-xl border border-border bg-card", className)}>{children}</div>
  )
}

export function SectionLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {children}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
    </div>
  )
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode
  tone?: "neutral" | "vault" | "facts" | "activity" | "meaning" | "human" | "ok" | "warn" | "bad"
  className?: string
}) {
  const tones: Record<string, string> = {
    neutral: "bg-muted text-muted-foreground ring-border",
    vault: "bg-vault/12 text-vault ring-vault/25",
    facts: "bg-facts/12 text-facts ring-facts/25",
    activity: "bg-activity/12 text-activity ring-activity/25",
    meaning: "bg-meaning/12 text-meaning ring-meaning/25",
    human: "bg-human/12 text-human ring-human/25",
    ok: "bg-activity/12 text-activity ring-activity/25",
    warn: "bg-vault/12 text-vault ring-vault/25",
    bad: "bg-human/15 text-human ring-human/30",
  }
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1 ring-inset",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Mono({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("font-mono text-[12px]", className)}>{children}</span>
}
