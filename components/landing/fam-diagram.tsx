'use client'

import { motion } from 'framer-motion'
import { FadeUp } from './fade-up'

const TRACES = [
  {
    label: 'Facts',
    sub: 'Foundry IQ',
    color: 'var(--color-facts)',
    d: 'M 96 150 C 200 150, 240 70, 392 70',
    y: 70,
  },
  {
    label: 'Activity',
    sub: 'Work IQ',
    color: 'var(--color-activity)',
    d: 'M 96 150 C 220 150, 270 150, 392 150',
    y: 150,
  },
  {
    label: 'Meaning',
    sub: 'Fabric IQ',
    color: 'var(--color-meaning)',
    d: 'M 96 150 C 200 150, 240 230, 392 230',
    y: 230,
  },
]

export function FamDiagram() {
  return (
    <section className="border-b border-line px-6 py-24 md:px-12 md:py-32 lg:px-20">
      <FadeUp className="max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.32em] text-mute">
          Grounding
        </p>
        <h2 className="mt-4 text-balance font-heading text-4xl font-bold leading-tight tracking-tight text-ink md:text-6xl">
          Grounded on Microsoft&apos;s intelligence layer — F.A.M.
        </h2>
      </FadeUp>

      <FadeUp delay={0.1}>
        <div className="mt-14 border border-line bg-card p-4 md:p-10">
          <svg
            viewBox="0 0 800 300"
            className="h-auto w-full"
            role="img"
            aria-label="Three source traces — Facts, Activity, and Meaning — converge at a governance seam and flow into a governed vault."
          >
            {/* traces */}
            {TRACES.map((t, i) => (
              <g key={t.label}>
                <motion.path
                  d={t.d}
                  fill="none"
                  stroke={t.color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.1, delay: i * 0.18, ease: 'easeInOut' }}
                />
                {/* flowing dot */}
                <circle r={3.5} fill={t.color}>
                  <animateMotion
                    dur="2.6s"
                    begin={`${i * 0.4}s`}
                    repeatCount="indefinite"
                    path={t.d}
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="linear"
                  />
                </circle>
                {/* source label */}
                <text
                  x={120}
                  y={t.y - 12}
                  className="font-mono"
                  fontSize="13"
                  fill={t.color}
                >
                  {t.label}
                </text>
                <text
                  x={120}
                  y={t.y + 4}
                  className="font-mono"
                  fontSize="11"
                  fill="var(--color-mute)"
                >
                  {t.sub}
                </text>
              </g>
            ))}

            {/* source node */}
            <circle cx={80} cy={150} r={14} fill="none" stroke="var(--color-dim)" strokeWidth={2} />
            <circle cx={80} cy={150} r={5} fill="var(--color-dim)" />

            {/* dashed governance seam */}
            <motion.line
              x1={420}
              y1={40}
              x2={420}
              y2={260}
              stroke="var(--color-mute)"
              strokeWidth={1.5}
              strokeDasharray="6 7"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            />
            <text x={420} y={28} textAnchor="middle" className="font-mono" fontSize="10" fill="var(--color-mute)">
              SEAM
            </text>

            {/* converge into vault */}
            {TRACES.map((t, i) => (
              <motion.path
                key={`merge-${i}`}
                d={`M 420 ${t.y} C 500 ${t.y}, 540 150, 600 150`}
                fill="none"
                stroke="var(--color-vault)"
                strokeWidth={2}
                strokeLinecap="round"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 0.85 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.9 + i * 0.1, ease: 'easeInOut' }}
              />
            ))}

            {/* governed vault box */}
            <motion.rect
              x={600}
              y={104}
              width={150}
              height={92}
              fill="none"
              stroke="var(--color-vault)"
              strokeWidth={2}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 1.1 }}
              style={{ transformOrigin: '675px 150px' }}
            />
            <text x={675} y={146} textAnchor="middle" className="font-mono" fontSize="13" fill="var(--color-vault)">
              GOVERNED
            </text>
            <text x={675} y={166} textAnchor="middle" className="font-mono" fontSize="13" fill="var(--color-vault)">
              VAULT
            </text>
          </svg>
        </div>
      </FadeUp>

      <FadeUp delay={0.15}>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-mute">
          Read-only · source-tagged · never merged into governed memory.
        </p>
        <p className="mt-3 font-heading text-xl font-medium text-ink md:text-2xl">
          grounding is rented · memory is owned.
        </p>
      </FadeUp>
    </section>
  )
}
