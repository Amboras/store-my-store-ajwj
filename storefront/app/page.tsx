'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Dumbbell, ShieldCheck, RotateCcw, Truck, Star, ChevronRight, Zap, Award, Heart } from 'lucide-react'
import { HERO_PLACEHOLDER, LIFESTYLE_PLACEHOLDER } from '@/lib/utils/placeholder-images'

const HERO_IMG = 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1400&q=85'
const LIFESTYLE_IMG = 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80'
const SET_IMG = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=80'

const resistanceLevels = [
  { color: 'bg-yellow-400', label: 'Extra Soft', sub: 'Beginners & Rehab' },
  { color: 'bg-green-500', label: 'Soft', sub: 'Warm-Up & Recovery' },
  { color: 'bg-blue-500', label: 'Medium', sub: 'Daily Training' },
  { color: 'bg-red-500', label: 'Hard', sub: 'Advanced Athletes' },
  { color: 'bg-gray-900', label: 'Extra Hard', sub: 'Elite Performance' },
]

const benefits = [
  {
    icon: Dumbbell,
    title: 'Build Grip Strength Fast',
    desc: 'Progressive resistance levels ensure continuous gains — from beginner to elite in one set.',
  },
  {
    icon: Heart,
    title: 'Rehab-Approved Design',
    desc: 'Recommended by physical therapists for post-injury hand and finger rehabilitation.',
  },
  {
    icon: Award,
    title: 'Medical-Grade Silicone',
    desc: 'Latex-free, odorless, and skin-safe. Built to last through thousands of reps.',
  },
  {
    icon: Zap,
    title: 'Train Anywhere',
    desc: 'Pocket-sized and portable — squeeze reps at your desk, in the car, or at the gym.',
  },
]

export default function HomePage() {
  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative bg-[hsl(0,0%,8%)] overflow-hidden min-h-[85vh] flex items-center">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={HERO_IMG}
            alt="Athlete training with GripForce"
            fill
            sizes="100vw"
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[hsl(0,0%,8%)] via-[hsl(0,0%,8%)]/80 to-transparent" />
        </div>

        <div className="container-custom relative z-10 py-24 lg:py-32">
          <div className="max-w-2xl space-y-7">
            <div className="inline-flex items-center gap-2 bg-[hsl(4,85%,50%)]/10 border border-[hsl(4,85%,50%)]/30 px-4 py-2 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[hsl(4,85%,50%)] animate-urgency" />
              <span className="text-[hsl(4,85%,50%)] text-xs font-semibold uppercase tracking-widest">
                Trusted by 40,000+ Athletes
              </span>
            </div>

            <h1 className="text-white font-heading font-bold leading-none tracking-tight" style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}>
              Grip Strength<br />
              <span className="text-[hsl(4,85%,50%)]">Starts Here.</span>
            </h1>

            <p className="text-white/70 text-lg max-w-lg leading-relaxed">
              Medical-grade silicone resistance rings for athletes, climbers, musicians, and anyone rehabbing hand or finger injuries. 5 resistance levels. One compact tool.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/products/gripforce-silicone-resistance-ring"
                className="inline-flex items-center gap-2 bg-[hsl(4,85%,50%)] text-white px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-[hsl(4,85%,42%)] transition-colors"
              >
                Shop Resistance Rings
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products/gripforce-complete-training-set-all-5-levels"
                className="inline-flex items-center gap-2 border border-white/30 text-white px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-white/10 transition-colors"
              >
                View Complete Set
              </Link>
            </div>

            {/* Social proof row */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white/60 text-sm">4.9/5 from 3,200+ verified buyers</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── RESISTANCE LEVELS ─── */}
      <section className="py-12 bg-white border-b">
        <div className="container-custom">
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">5 Resistance Levels</p>
            <h2 className="text-h3 font-heading font-bold mt-1">Every Level. Every Goal.</h2>
          </div>
          <div className="grid grid-cols-5 gap-3 max-w-3xl mx-auto">
            {resistanceLevels.map((level) => (
              <Link
                key={level.label}
                href="/products/gripforce-silicone-resistance-ring"
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className={`w-14 h-14 rounded-full ${level.color} shadow-lg group-hover:scale-110 transition-transform duration-200`} />
                <span className="text-xs font-bold text-center leading-tight">{level.label}</span>
                <span className="text-[10px] text-muted-foreground text-center leading-tight hidden sm:block">{level.sub}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED PRODUCTS ─── */}
      <section className="py-section bg-[hsl(220,10%,97%)]">
        <div className="container-custom">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-widest text-[hsl(4,85%,50%)] font-semibold mb-1">Best Sellers</p>
              <h2 className="text-h2 font-heading font-bold">Shop GripForce</h2>
            </div>
            <Link href="/products" className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide link-underline pb-0.5">
              View All
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
            {/* Product 1 */}
            <Link href="/products/gripforce-silicone-resistance-ring" className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-muted rounded-sm mb-4">
                <Image
                  src={HERO_IMG}
                  alt="GripForce Silicone Resistance Ring"
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-[hsl(4,85%,50%)] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5">
                    Best Seller
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Single Ring</p>
                <h3 className="font-heading font-bold text-lg">GripForce Resistance Ring</h3>
                <p className="text-sm text-muted-foreground">Choose your resistance level</p>
                <p className="font-bold text-lg mt-2">$12.99</p>
              </div>
            </Link>

            {/* Product 2 */}
            <Link href="/products/gripforce-complete-training-set-all-5-levels" className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-muted rounded-sm mb-4">
                <Image
                  src={SET_IMG}
                  alt="GripForce Complete Training Set"
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-[hsl(0,0%,8%)] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1.5">
                    Best Value
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Complete Set</p>
                <h3 className="font-heading font-bold text-lg">Complete Training Set — All 5 Levels</h3>
                <p className="text-sm text-muted-foreground">Full progression kit + carry pouch</p>
                <p className="font-bold text-lg mt-2">$39.99</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── BENEFITS ─── */}
      <section className="py-section bg-white">
        <div className="container-custom">
          <div className="max-w-xl mb-12">
            <p className="text-xs uppercase tracking-widest text-[hsl(4,85%,50%)] font-semibold mb-2">Why GripForce</p>
            <h2 className="text-h2 font-heading font-bold">Built for Results,<br />Backed by Science.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="space-y-3">
                <div className="w-10 h-10 flex items-center justify-center bg-[hsl(4,85%,50%)]/10 rounded-sm">
                  <benefit.icon className="h-5 w-5 text-[hsl(4,85%,50%)]" strokeWidth={1.5} />
                </div>
                <h3 className="font-heading font-bold text-base">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LIFESTYLE / STORY ─── */}
      <section className="py-section bg-[hsl(0,0%,8%)]">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
              <Image
                src={LIFESTYLE_IMG}
                alt="Athlete using GripForce at the gym"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="space-y-6 text-white">
              <p className="text-xs uppercase tracking-widest text-[hsl(4,85%,50%)] font-semibold">Our Mission</p>
              <h2 className="text-h2 font-heading font-bold leading-tight">
                Train Like You Mean It.
              </h2>
              <p className="text-white/70 leading-relaxed">
                Grip strength is the most underrated performance metric. Whether you&apos;re a competitive climber, a weekend lifter, or coming back from a wrist injury — stronger hands unlock everything.
              </p>
              <p className="text-white/70 leading-relaxed">
                GripForce was built for people who train with intention. Every ring is engineered with consistent resistance, medical-grade silicone, and a compact form that fits your life.
              </p>
              <Link
                href="/products/gripforce-silicone-resistance-ring"
                className="inline-flex items-center gap-2 bg-[hsl(4,85%,50%)] text-white px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-[hsl(4,85%,42%)] transition-colors"
              >
                Start Training
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className="py-10 border-y bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
            <div className="flex items-center gap-4 justify-center">
              <Truck className="h-6 w-6 flex-shrink-0 text-[hsl(4,85%,50%)]" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-bold">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over $35</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <RotateCcw className="h-6 w-6 flex-shrink-0 text-[hsl(4,85%,50%)]" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-bold">30-Day Returns</p>
                <p className="text-xs text-muted-foreground">No questions asked</p>
              </div>
            </div>
            <div className="flex items-center gap-4 justify-center">
              <ShieldCheck className="h-6 w-6 flex-shrink-0 text-[hsl(4,85%,50%)]" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-bold">Secure Checkout</p>
                <p className="text-xs text-muted-foreground">256-bit SSL encrypted</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-section bg-[hsl(4,85%,50%)]">
        <div className="container-custom text-center text-white max-w-2xl">
          <h2 className="text-h2 font-heading font-bold mb-4">Ready to Get a Stronger Grip?</h2>
          <p className="text-white/80 mb-8 text-lg">
            Join 40,000+ athletes already training with GripForce. Start with a single ring or get the complete set and train every level.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/products/gripforce-silicone-resistance-ring"
              className="inline-flex items-center gap-2 bg-white text-[hsl(0,0%,8%)] px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-white/90 transition-colors"
            >
              Shop Single Rings — $12.99
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products/gripforce-complete-training-set-all-5-levels"
              className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-4 text-sm font-bold uppercase tracking-wide hover:bg-white/10 transition-colors"
            >
              Get Complete Set — $39.99
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
