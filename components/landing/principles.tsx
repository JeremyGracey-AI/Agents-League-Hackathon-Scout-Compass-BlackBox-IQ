import { FadeUp } from './fade-up'

const PRINCIPLES = [
  {
    n: '01',
    head: 'Agents propose, humans promote.',
    body: 'Nothing enters governed memory automatically. Every promotion is a deliberate, attributable act.',
  },
  {
    n: '02',
    head: 'The git log IS the audit trail.',
    body: 'No separate ledger to trust. The full history of what changed, when, and why lives in version control.',
  },
  {
    n: '03',
    head: 'Behavior is revertible; history is not.',
    body: 'Roll an agent back to any prior competence, while the record of how it got there stays permanent.',
  },
]

export function Principles() {
  return (
    <section className="border-b border-line px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <FadeUp>
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-mute">
          Guarantees
        </p>
        <h2 className="mt-4 max-w-3xl text-balance font-heading text-4xl font-bold leading-tight tracking-tight text-ink md:text-6xl">
          How it holds
        </h2>
      </FadeUp>

      <div className="mt-14 grid grid-cols-1 gap-px border border-line bg-line md:grid-cols-3">
        {PRINCIPLES.map((p, i) => (
          <FadeUp key={p.n} delay={i * 0.1} className="h-full">
            <div className="flex h-full flex-col bg-bg p-8 md:p-10">
              <span className="font-mono text-sm text-mute">{p.n}</span>
              <h3 className="mt-6 font-heading text-2xl font-bold leading-tight tracking-tight text-ink">
                {p.head}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-dim">{p.body}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}
