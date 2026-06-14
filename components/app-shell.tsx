"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Compass,
  Hammer,
  Activity,
  ShieldCheck,
  LayoutDashboard,
  Github,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react"

const nav = [
  { href: "/", label: "Overview", icon: LayoutDashboard, hint: "The three layers, end to end" },
  { href: "/forge", label: "Skill Forge", icon: Hammer, hint: "Compass Rose — build & install skills" },
  { href: "/trace", label: "Reasoning Trace", icon: Activity, hint: "GM Louis — F.A.M. grounding" },
  { href: "/vault", label: "Vault & Audit", icon: ShieldCheck, hint: "BlackBox IQ — governed memory" },
]

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-panel-2/80 backdrop-blur-xl transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center gap-3 px-5 py-5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
            <Compass className="h-5 w-5 text-primary" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-tight">Compass-BlackBox IQ</p>
            <p className="text-[11px] text-muted-foreground">governed memory & competence</p>
          </div>
          <button
            className="ml-auto rounded-md p-1.5 text-muted-foreground hover:bg-accent lg:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close navigation"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-2">
          {nav.map((item) => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "group flex items-start gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                )}
              >
                <Icon
                  className={cn(
                    "mt-0.5 h-4 w-4 flex-none",
                    active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                  )}
                />
                <span className="flex flex-col">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-[11px] text-muted-foreground/80">{item.hint}</span>
                </span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-3">
          <a
            href="https://github.com/JeremyGracey-AI/Agents-League-Hackathon-Compass-BlackBox-IQ"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
          >
            <Github className="h-4 w-4" />
            <span className="flex-1">View on GitHub</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
          <p className="px-3 pt-2 text-[10px] leading-relaxed text-muted-foreground/70">
            Agents League @ AI Skills Fest 2026 · Reasoning Agents track
          </p>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-xl lg:hidden">
          <button
            className="rounded-md p-1.5 text-muted-foreground hover:bg-accent"
            onClick={() => setOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Compass-BlackBox IQ</span>
          </div>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
