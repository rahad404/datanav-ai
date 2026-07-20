"use client"

/**
 * DataNav AI — Landing page
 *
 * Design tokens (see comment block for the reasoning):
 *   Ink    #0B1220  — base dark background (hero, CTA, footer-adjacent bands)
 *   Panel  #121B2E  — card surface on dark sections
 *   Signal #2EE6C8  — primary accent (trend/positive/AI signal)
 *   Amber  #F5A623  — secondary accent (risk/highlight — used sparingly)
 *   Paper  #F7F8FA  — light section background
 *   Slate  #8C96AA  — muted text on dark
 *
 * Type: Space Grotesk (display) / IBM Plex Sans (body) / IBM Plex Mono (data figures).
 * The mono face is used specifically for every number on the page — KPI values,
 * stats, prices — so the page reads like a readout, not a brochure.
 *
 * Signature element: the "Insight Card" — a left-accent-bar card with a mono
 * figure and a sparkline. It's the actual shape of what the product outputs,
 * reused in the hero carousel, the sample-report section, and the stats band,
 * so the page's decoration IS the product.
 *
 * NOTE: add Space Grotesk / IBM Plex Sans / IBM Plex Mono to your root layout
 * via next/font/google for optimal loading. A CSS @import fallback is included
 * below so this page renders correctly on its own either way.
 */

import * as React from "react"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Upload,
  Sparkles,
  ShieldAlert,
  MessageCircle,
  ArrowRight,
  FileSpreadsheet,
  FileJson,
  FileText,
  Star,
  Mail,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type SlideKind = "trend" | "kpi" | "risk" | "recommendation"

const heroSlides: {
  kind: SlideKind
  eyebrow: string
  title: string
  figure: string
  detail: string
}[] = [
  {
    kind: "trend",
    eyebrow: "Trend detected",
    title: "Revenue, North region",
    figure: "+18.4%",
    detail: "Steady climb over the last 6 weeks, driven by repeat orders.",
  },
  {
    kind: "kpi",
    eyebrow: "KPI summary",
    title: "Avg. order value",
    figure: "$142.30",
    detail: "Up from $128.90 last quarter — bundling is working.",
  },
  {
    kind: "risk",
    eyebrow: "Risk flagged",
    title: "Churn, Enterprise tier",
    figure: "12.7%",
    detail: "Three accounts show usage drop-off in the past 30 days.",
  },
  {
    kind: "recommendation",
    eyebrow: "Recommended action",
    title: "Restock signal",
    figure: "SKU-4471",
    detail: "Sell-through outpacing supply — reorder within 2 weeks.",
  },
]

const kindStyles: Record<
  SlideKind,
  { bar: string; icon: React.ReactNode; label: string }
> = {
  trend: { bar: "bg-[#2EE6C8]", icon: <TrendingUp className="size-4" />, label: "text-[#2EE6C8]" },
  kpi: { bar: "bg-[#2EE6C8]", icon: <Minus className="size-4" />, label: "text-[#2EE6C8]" },
  risk: { bar: "bg-[#F5A623]", icon: <ShieldAlert className="size-4" />, label: "text-[#F5A623]" },
  recommendation: { bar: "bg-[#F5A623]", icon: <TrendingDown className="size-4" />, label: "text-[#F5A623]" },
}

const features = [
  {
    icon: <Upload className="size-5" />,
    title: "Any format, no cleanup",
    description: "Drop in a CSV, Excel file, or raw JSON. We detect the schema and handle the mess.",
  },
  {
    icon: <Sparkles className="size-5" />,
    title: "Structured AI insights",
    description: "Not a wall of text — a summary, trend list, KPI set, and risk callouts every time.",
  },
  {
    icon: <ShieldAlert className="size-5" />,
    title: "Risk detection built in",
    description: "The model is prompted specifically to surface what's going wrong, not just what's up.",
  },
  {
    icon: <MessageCircle className="size-5" />,
    title: "Ask follow-up questions",
    description: "The assistant knows the report you're looking at and answers in that context.",
  },
]

const steps = [
  { n: "01", title: "Upload your file", description: "CSV, XLSX, or JSON — up to 10MB, no template required." },
  { n: "02", title: "We read the shape of it", description: "Columns, ranges, and row counts are parsed before anything hits the model." },
  { n: "03", title: "AI analyzes it", description: "Trends, KPIs, risks, and recommendations are generated as structured output." },
  { n: "04", title: "You get a report", description: "Read it in-app, ask follow-ups, or download it to share." },
]

const fileTypes = [
  { icon: <FileSpreadsheet className="size-6" />, name: "CSV", note: "Comma or tab separated, headers auto-detected" },
  { icon: <FileSpreadsheet className="size-6" />, name: "XLSX / XLS", note: "First sheet is read; multi-sheet support coming" },
  { icon: <FileJson className="size-6" />, name: "JSON", note: "Array of records, or an object with a data[] field" },
]

const stats = [
  { value: "540K+", label: "Rows analyzed this month" },
  { value: "38s", label: "Avg. time to first insight" },
  { value: "3", label: "File formats supported" },
  { value: "24/7", label: "Assistant availability" },
]

const testimonials = [
  {
    initials: "RM",
    name: "Rae M.",
    role: "Ops lead, mid-size retailer",
    quote:
      "I stopped exporting the same spreadsheet into five different chart tools. Upload, read, done.",
  },
  {
    initials: "JT",
    name: "Jordan T.",
    role: "Finance, early-stage startup",
    quote:
      "The risk callouts caught a churn pattern two weeks before it showed up in our actual numbers.",
  },
  {
    initials: "AK",
    name: "Asha K.",
    role: "Founder, DTC brand",
    quote: "It reads like a analyst wrote it, not like a model dumping a paragraph on me.",
  },
]

const faqs = [
  {
    q: "What file size can I upload?",
    a: "Up to 10MB per file today. That covers most CSV and Excel exports — larger datasets can be sampled or split.",
  },
  {
    q: "Is my data used to train anything?",
    a: "No. Your files are processed to generate your report and are not used to train any model.",
  },
  {
    q: "Which AI provider powers the analysis?",
    a: "You can configure any OpenAI-compatible provider on the backend — OpenAI, Groq, Together, or a local Ollama model.",
  },
  {
    q: "How accurate is the analysis?",
    a: "The model reasons over real statistics we compute from your file first, not just raw rows — but always treat it as a fast first read, not a final audit.",
  },
  {
    q: "Is there a free tier?",
    a: "Yes — every account can run quick analyses for free. Deep analysis and PDF export are part of the paid plan.",
  },
]

// ---------------------------------------------------------------------------
// Small building blocks
// ---------------------------------------------------------------------------

function InsightCard({ slide }: { slide: (typeof heroSlides)[number] }) {
  const style = kindStyles[slide.kind]
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-2xl bg-[#121B2E] p-6 shadow-2xl shadow-black/40 ring-1 ring-white/10">
      <div className={`absolute left-0 top-0 h-full w-1.5 ${style.bar}`} />
      <div className="pl-3">
        <div className={`flex items-center gap-2 text-xs font-medium uppercase tracking-wider ${style.label}`}>
          {style.icon}
          {slide.eyebrow}
        </div>
        <p className="mt-3 text-sm text-[#8C96AA]">{slide.title}</p>
        <p className="mt-1 font-mono text-4xl font-semibold text-white">{slide.figure}</p>
        <p className="mt-3 text-sm leading-relaxed text-[#8C96AA]">{slide.detail}</p>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="group rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
      <div className="flex size-11 items-center justify-center rounded-xl bg-[#0B1220] text-[#2EE6C8] transition-colors group-hover:bg-[#2EE6C8] group-hover:text-[#0B1220]">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-[#0B1220]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[#5B6478]">{description}</p>
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="border-b border-black/10 py-5">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between text-left"
        aria-expanded={open}
      >
        <span className="text-base font-medium text-[#0B1220]">{q}</span>
        <span
          className={`ml-4 shrink-0 text-xl leading-none text-[#8C96AA] transition-transform ${open ? "rotate-45" : ""}`}
        >
          +
        </span>
      </button>
      {open && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#5B6478]">{a}</p>}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LandingPage() {
  const [slide, setSlide] = React.useState(0)
  const [emailSubmitted, setEmailSubmitted] = React.useState(false)

  React.useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return
    const id = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 4000)
    return () => clearInterval(id)
  }, [])

  const goTo = (i: number) => setSlide((i + heroSlides.length) % heroSlides.length)

  return (
    <div className="font-sans" style={{ fontFamily: "'IBM Plex Sans', system-ui, sans-serif" }}>
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap");
        .font-display {
          font-family: "Space Grotesk", system-ui, sans-serif;
        }
        .font-mono {
          font-family: "IBM Plex Mono", ui-monospace, monospace;
        }
      `}</style>

      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-[#0B1220]">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 md:py-28 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex items-center rounded-full border border-[#2EE6C8]/30 bg-[#2EE6C8]/10 px-3 py-1 font-mono text-xs font-medium tracking-wide text-[#2EE6C8]">
              AI DATA ANALYSIS
            </span>
            <h1 className="font-display mt-5 text-4xl font-semibold leading-[1.1] text-white sm:text-5xl lg:text-6xl">
              Turn raw spreadsheets into answers you can act on
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#8C96AA]">
              Upload a CSV, Excel file, or JSON export. DataNav AI reads the shape of your data and hands back
              trends, KPIs, and risks in plain language — in under a minute.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/register">
                <Button size="lg" className="gap-2 bg-[#2EE6C8] text-[#0B1220] hover:bg-[#2EE6C8]/90">
                  Start a free analysis
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="#sample-report">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5">
                  See a sample report
                </Button>
              </Link>
            </div>
            <p className="mt-6 font-mono text-xs text-[#8C96AA]">
              No credit card · Free quick analysis on every account
            </p>
          </div>

          {/* Hero carousel of Insight Cards */}
          <div className="relative">
            <div className="relative h-72 sm:h-80">
              {heroSlides.map((s, i) => (
                <div
                  key={s.title}
                  className="absolute inset-0 transition-opacity duration-700"
                  style={{ opacity: i === slide ? 1 : 0, pointerEvents: i === slide ? "auto" : "none" }}
                  aria-hidden={i !== slide}
                >
                  <InsightCard slide={s} />
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <div className="flex gap-2">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    aria-label={`Show insight ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      i === slide ? "w-6 bg-[#2EE6C8]" : "w-1.5 bg-white/20"
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => goTo(slide - 1)}
                  aria-label="Previous insight"
                  className="flex size-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  onClick={() => goTo(slide + 1)}
                  aria-label="Next insight"
                  className="flex size-8 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <ChevronRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FEATURES ---------------- */}
      <section className="bg-[#F7F8FA] py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-xl">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-[#2EE6C8]">
              Why DataNav AI
            </span>
            <h2 className="font-display mt-3 text-3xl font-semibold text-[#0B1220] sm:text-4xl">
              Built for the file you already have, not a perfect one
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-xl">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-[#F5A623]">
              The process
            </span>
            <h2 className="font-display mt-3 text-3xl font-semibold text-[#0B1220] sm:text-4xl">
              From upload to insight in four steps
            </h2>
          </div>
          <div className="mt-12 grid gap-8 lg:grid-cols-4">
            {steps.map((s, i) => (
              <div key={s.n} className="relative pl-0">
                <span className="font-mono text-sm font-semibold text-[#8C96AA]">{s.n}</span>
                <h3 className="mt-2 text-lg font-semibold text-[#0B1220]">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5B6478]">{s.description}</p>
                {i < steps.length - 1 && (
                  <div className="mt-6 hidden h-px w-full bg-gradient-to-r from-black/10 to-transparent lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SUPPORTED FILE TYPES ---------------- */}
      <section className="bg-[#F7F8FA] py-20">
        <div className="mx-auto max-w-7xl px-4">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-[#2EE6C8]">
            Supported files
          </span>
          <h2 className="font-display mt-3 text-3xl font-semibold text-[#0B1220] sm:text-4xl">
            Bring what you've already got
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {fileTypes.map((f) => (
              <div key={f.name} className="flex items-start gap-4 rounded-2xl border border-black/5 bg-white p-6">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#0B1220] text-[#2EE6C8]">
                  {f.icon}
                </div>
                <div>
                  <p className="font-mono text-sm font-semibold text-[#0B1220]">{f.name}</p>
                  <p className="mt-1 text-sm text-[#5B6478]">{f.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SAMPLE INSIGHTS PREVIEW ---------------- */}
      <section id="sample-report" className="bg-[#0B1220] py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-xl">
            <span className="font-mono text-xs font-medium uppercase tracking-wider text-[#2EE6C8]">
              See what you'll get
            </span>
            <h2 className="font-display mt-3 text-3xl font-semibold text-white sm:text-4xl">
              A sample report, built the same way yours will be
            </h2>
            <p className="mt-4 text-[#8C96AA]">
              Figures below are illustrative, generated from a sample sales dataset — the same structured shape
              every report follows.
            </p>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            <div className="rounded-2xl bg-[#121B2E] p-6 ring-1 ring-white/10 lg:col-span-2">
              <p className="font-mono text-xs uppercase tracking-wider text-[#8C96AA]">Summary</p>
              <p className="mt-3 text-sm leading-relaxed text-[#D3D8E3]">
                Q2 sales grew across every region except the Midwest, where a single distributor delay explains
                most of the shortfall. Average order value is climbing on the back of bundled products, while
                three enterprise accounts show early churn signals worth a check-in this week.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {heroSlides.slice(0, 2).map((s) => (
                  <div key={s.title} className="rounded-xl bg-[#0B1220] p-4">
                    <p className={`text-xs font-medium ${kindStyles[s.kind].label}`}>{s.eyebrow}</p>
                    <p className="mt-1 font-mono text-2xl font-semibold text-white">{s.figure}</p>
                    <p className="mt-1 text-xs text-[#8C96AA]">{s.title}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-[#121B2E] p-6 ring-1 ring-[#F5A623]/20">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[#F5A623]">
                <ShieldAlert className="size-4" />
                Risk flagged
              </div>
              <p className="mt-3 font-mono text-2xl font-semibold text-white">Enterprise churn — 12.7%</p>
              <p className="mt-2 text-sm leading-relaxed text-[#8C96AA]">
                Three accounts show usage drop-off over 30 days. Recommended: reach out before renewal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- STATS ---------------- */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="border-l-2 border-[#2EE6C8] pl-4">
                <p className="font-mono text-3xl font-semibold text-[#0B1220]">{s.value}</p>
                <p className="mt-1 text-sm text-[#5B6478]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- TESTIMONIALS ---------------- */}
      <section className="bg-[#F7F8FA] py-20">
        <div className="mx-auto max-w-7xl px-4">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-[#F5A623]">
            From the people using it
          </span>
          <h2 className="font-display mt-3 text-3xl font-semibold text-[#0B1220] sm:text-4xl">
            Fewer exports, faster answers
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex gap-0.5 text-[#F5A623]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#3A4152]">"{t.quote}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-full bg-[#0B1220] font-mono text-xs font-semibold text-[#2EE6C8]">
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#0B1220]">{t.name}</p>
                    <p className="text-xs text-[#8C96AA]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-3xl px-4">
          <span className="font-mono text-xs font-medium uppercase tracking-wider text-[#2EE6C8]">FAQ</span>
          <h2 className="font-display mt-3 text-3xl font-semibold text-[#0B1220] sm:text-4xl">
            Questions worth answering upfront
          </h2>
          <div className="mt-8">
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="bg-[#0B1220] py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl">
            Stop guessing. Start knowing.
          </h2>
          <p className="mt-4 text-[#8C96AA]">Your first analysis is free — no setup, no template to follow.</p>
          <div className="mt-8">
            <Link href="/register">
              <Button size="lg" className="gap-2 bg-[#2EE6C8] text-[#0B1220] hover:bg-[#2EE6C8]/90">
                Start a free analysis
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- NEWSLETTER ---------------- */}
      <section className="bg-[#F7F8FA] py-16">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <Mail className="mx-auto size-6 text-[#2EE6C8]" />
          <h3 className="font-display mt-3 text-2xl font-semibold text-[#0B1220]">
            One sharp insight, every two weeks
          </h3>
          <p className="mt-2 text-sm text-[#5B6478]">
            A short read on data patterns worth knowing about. No spam, unsubscribe anytime.
          </p>
          {emailSubmitted ? (
            <p className="mt-6 flex items-center justify-center gap-2 font-mono text-sm text-[#0B1220]">
              <CheckCircle2 className="size-4 text-[#2EE6C8]" />
              You're on the list.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setEmailSubmitted(true)
              }}
              className="mx-auto mt-6 flex max-w-md gap-2"
            >
              <input
                type="email"
                required
                placeholder="you@company.com"
                className="w-full rounded-lg border border-black/10 bg-white px-4 py-2 text-sm text-[#0B1220] outline-none focus:border-[#2EE6C8] focus:ring-2 focus:ring-[#2EE6C8]/30"
              />
              <Button type="submit" className="bg-[#0B1220] text-white hover:bg-[#0B1220]/90">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}