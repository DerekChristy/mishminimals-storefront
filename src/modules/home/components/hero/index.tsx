import { Button, Heading } from "@modules/common/components/ui"
import Link from "next/link"

const Hero = () => {
  return (
    <div className="h-[80vh] w-full border-b border-ui-border-base relative bg-[#FAF9F6]">
      {/* Editorial Background Accent */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e5e5_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center p-6 small:p-32 gap-8 max-w-4xl mx-auto">
        <div className="flex flex-col gap-y-3">
          <span className="text-xs font-bold tracking-[0.25em] uppercase text-ui-fg-muted">
            Mishminimals // Core Collection
          </span>
          
          <Heading
            level="h1"
            className="text-4xl small:text-6xl tracking-tight text-ui-fg-base font-light font-sans"
          >
            Minimalist Geometry. <br />
            <span className="font-normal italic text-ui-fg-subtle">Maximalist Durability.</span>
          </Heading>
        </div>

        <p className="text-base small:text-lg text-ui-fg-subtle font-light max-w-xl leading-relaxed">
          18k gold-plated, anti-tarnish jewelry engineered for daily wear. 
          Sweat-proof, water-resistant, and entirely nickel-free.
        </p>

        <div className="flex flex-col small:flex-row items-center gap-4 w-full small:w-auto">
          <Link href="/store" className="w-full small:w-auto">
            <Button 
              variant="primary" 
              className="w-full small:w-auto px-8 py-3 text-sm font-medium hover:bg-ui-bg-base-hover transition-colors rounded-none"
            >
              Shop Essentials
            </Button>
          </Link>
          
          <Link href="/store?curate=true" className="w-full small:w-auto">
            <Button 
              variant="secondary" 
              className="w-full small:w-auto px-8 py-3 text-sm font-medium border border-ui-border-strong text-ui-fg-base hover:bg-ui-bg-subtle-hover transition-colors rounded-none bg-transparent"
            >
              Build a Custom Gift Box
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Hero
