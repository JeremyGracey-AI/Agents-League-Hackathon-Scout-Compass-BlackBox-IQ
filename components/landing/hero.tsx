'use client'

import { motion } from 'framer-motion'

const WALKTHROUGH = 'https://compass-blackbox-iq.vercel.app/?present=1'
const GITHUB = 'https://github.com/JeremyGracey-AI/Agents-League-Hackathon-Compass-BlackBox-IQ'

export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center overflow-hidden border-b border-line px-6 py-24 md:px-12 lg:px-20">
      {/* soft radial glow, top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[42rem] w-[42rem] rounded-full opacity-50 blur-[120px]"
        style={{
          background:
            'radial-gradient(circle at center, rgba(79,140,255,0.28), rgba(152,113,240,0.10) 45%, transparent 70%)',
        }}
      />

      {/* compass artwork */}
      <img
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/compass_hand_msft-rmXG6mhwdF4kowLv7Cnh9kBIAAJ6F7.png"
        alt="A low-poly digital hand holding a glowing compass, representing guided autonomous reasoning"
        className="pointer-events-none absolute right-0 top-1/2 hidden w-[44rem] max-w-[55vw] -translate-y-1/2 opacity-70 lg:block"
      />

      <div className="relative z-10 max-w-4xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-[11px] uppercase tracking-[0.32em] text-mute md:text-xs"
        >
          Agents League · Reasoning Agents · Microsoft Foundry + MCP
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 text-balance font-heading text-5xl font-bold leading-[0.95] tracking-tight text-ink sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Compass-BlackBox IQ
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-2xl text-pretty text-xl leading-relaxed text-dim md:text-[28px] md:leading-snug"
        >
          The governance layer for an autonomous agent&apos;s memory &amp; competence.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-mute md:text-lg"
        >
          Microsoft governs what an agent is{' '}
          <em className="not-italic text-dim">allowed</em> to do. We govern what it{' '}
          <em className="not-italic text-ink">knows, did, and learned.</em>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href={WALKTHROUGH}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center border border-vault bg-vault px-7 py-4 font-mono text-sm font-semibold uppercase tracking-wider text-bg transition-colors hover:bg-transparent hover:text-vault"
          >
            ▶ Watch the walkthrough
          </a>
          <a
            href={GITHUB}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center border border-line px-7 py-4 font-mono text-sm font-semibold uppercase tracking-wider text-ink transition-colors hover:border-ink"
          >
            View on GitHub ↗
          </a>
        </motion.div>
      </div>
    </section>
  )
}
