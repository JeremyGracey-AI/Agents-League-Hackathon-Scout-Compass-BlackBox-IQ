const LINKS = [
  { label: 'Walkthrough', href: 'https://compass-blackbox-iq.vercel.app/?present=1' },
  { label: 'GM Louis', href: 'https://gm-louis.vercel.app' },
  { label: 'Compass Rose', href: 'https://compass-rose-beta.vercel.app' },
  {
    label: 'GitHub',
    href: 'https://github.com/JeremyGracey-AI/Agents-League-Hackathon-Compass-BlackBox-IQ',
  },
]

export function SiteFooter() {
  return (
    <footer className="px-6 py-16 md:px-12 lg:px-20">
      <nav className="flex flex-wrap items-center gap-x-8 gap-y-3">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-sm uppercase tracking-[0.14em] text-dim transition-colors hover:text-vault"
          >
            {l.label} ↗
          </a>
        ))}
      </nav>
      <p className="mt-10 font-mono text-xs leading-relaxed text-mute">
        Agents League @ AI Skills Fest 2026 · Reasoning Agents track · built solo by Jeremy Gracey.
      </p>
    </footer>
  )
}
