import { FadeUp } from './fade-up'

type Layer = {
  name: string
  line: string
  url: string
  display: string
  tag: string
  accent: string
}

const LAYERS: Layer[] = [
  {
    name: 'Compass Rose',
    line: 'Builds role-aligned skills.',
    url: 'https://compass-rose-beta.vercel.app',
    display: 'compass-rose-beta.vercel.app',
    tag: 'skill-forge · no YAML',
    accent: 'var(--color-facts)',
  },
  {
    name: 'GM Louis',
    line: 'Reasons over the governed loop.',
    url: 'https://gm-louis.vercel.app',
    display: 'gm-louis.vercel.app',
    tag: 'the agent · live',
    accent: 'var(--color-activity)',
  },
  {
    name: 'BlackBox IQ',
    line: 'Governs & records memory + competence.',
    url: 'https://compass-blackbox-iq.vercel.app',
    display: 'compass-blackbox-iq.vercel.app',
    tag: 'the governed vault',
    accent: 'var(--color-vault)',
  },
]

export function Layers() {
  return (
    <section className="border-b border-line px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <FadeUp>
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-mute">
          The stack
        </p>
        <h2 className="mt-4 max-w-3xl text-balance font-heading text-4xl font-bold leading-tight tracking-tight text-ink md:text-6xl">
          One platform, three layers
        </h2>
      </FadeUp>

      <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {LAYERS.map((layer, i) => (
          <FadeUp key={layer.name} delay={i * 0.1}>
            <a
              href={layer.url}
              target="_blank"
              rel="noreferrer"
              className="group relative flex h-full flex-col border border-line bg-card p-8 transition-colors duration-300"
              style={{ borderColor: 'var(--color-line)' }}
            >
              {/* accent rail */}
              <span
                aria-hidden
                className="absolute left-0 top-0 h-full w-[3px]"
                style={{ background: layer.accent }}
              />
              <span
                aria-hidden
                className="absolute inset-0 -z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  boxShadow: `inset 0 0 0 1px ${layer.accent}`,
                }}
              />

              <div className="flex items-start justify-between">
                <h3 className="font-heading text-2xl font-bold tracking-tight text-ink md:text-3xl">
                  {layer.name}
                </h3>
                <span
                  className="font-mono text-xl transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  style={{ color: layer.accent }}
                  aria-hidden
                >
                  ↗
                </span>
              </div>

              <p className="mt-3 text-lg leading-relaxed text-dim">{layer.line}</p>

              <div className="mt-auto pt-10">
                <p
                  className="font-mono text-xs"
                  style={{ color: layer.accent }}
                >
                  {layer.display}
                </p>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-mute">
                  {layer.tag}
                </p>
              </div>
            </a>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}
