import { Hero } from '@/components/landing/hero'
import { Layers } from '@/components/landing/layers'
import { FamDiagram } from '@/components/landing/fam-diagram'
import { Principles } from '@/components/landing/principles'
import { SiteFooter } from '@/components/landing/site-footer'

export default function Page() {
  return (
    <main className="bg-bg">
      <Hero />
      <Layers />
      <FamDiagram />
      <Principles />
      <SiteFooter />
    </main>
  )
}
