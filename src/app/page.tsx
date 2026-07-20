"use client"

import * as React from "react"
import Link from "next/link"
import {
  Upload,
  Sparkles,
  ShieldAlert,
  MessageCircle,
  ArrowRight,
  FileSpreadsheet,
  FileJson,
  TrendingUp,
  TrendingDown,
  Minus,
  CheckCircle2,
  ChevronRight,
  Compass,
  BarChart3,
  LineChart,
  PieChart,
  Download,
  Brain,
  Globe,
  Zap,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

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
  trend: { bar: "bg-emerald-500", icon: <TrendingUp className="size-4" />, label: "text-emerald-500" },
  kpi: { bar: "bg-emerald-500", icon: <Minus className="size-4" />, label: "text-emerald-500" },
  risk: { bar: "bg-orange-500", icon: <ShieldAlert className="size-4" />, label: "text-orange-500" },
  recommendation: { bar: "bg-orange-500", icon: <TrendingDown className="size-4" />, label: "text-orange-500" },
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
  {
    icon: <Download className="size-5" />,
    title: "Export & share",
    description: "Download your analysis as a PDF report to share with your team.",
  },
  {
    icon: <Brain className="size-5" />,
    title: "Smart context awareness",
    description: "The chatbot understands what page you're on and which report you're viewing.",
  },
]

const steps = [
  { n: "01", title: "Upload your file", description: "CSV, XLSX, or JSON — up to 10MB, no template required." },
  { n: "02", title: "We read the shape of it", description: "Columns, ranges, and row counts are parsed before anything hits the model." },
  { n: "03", title: "AI analyzes it", description: "Trends, KPIs, risks, and recommendations are generated as structured output." },
  { n: "04", title: "You get a report", description: "Read it in-app, ask follow-ups, or download it to share." },
]

const fileTypes = [
  { icon: <FileSpreadsheet className="size-8" />, name: "CSV", note: "Comma or tab separated, headers auto-detected" },
  { icon: <FileSpreadsheet className="size-8" />, name: "XLSX / XLS", note: "First sheet is read; multi-sheet support coming" },
  { icon: <FileJson className="size-8" />, name: "JSON", note: "Array of records, or an object with a data[] field" },
]

const stats = [
  { value: "540K+", label: "Rows analyzed this month" },
  { value: "38s", label: "Avg. time to first insight" },
  { value: "3", label: "File formats supported" },
  { value: "24/7", label: "Assistant availability" },
]

const testimonials = [
  {
    name: "Rae M.",
    role: "Ops lead, mid-size retailer",
    quote:
      "I stopped exporting the same spreadsheet into five different chart tools. Upload, read, done.",
  },
  {
    name: "Jordan T.",
    role: "Finance, early-stage startup",
    quote:
      "The risk callouts caught a churn pattern two weeks before it showed up in our actual numbers.",
  },
  {
    name: "Asha K.",
    role: "Founder, DTC brand",
    quote: "It reads like an analyst wrote it, not like a model dumping a paragraph on me.",
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
// Components
// ---------------------------------------------------------------------------

function InsightCard({ slide }: { slide: (typeof heroSlides)[number] }) {
  const style = kindStyles[slide.kind]
  return (
    <div className="group relative overflow-hidden rounded-xl border bg-card p-5 transition-all hover:shadow-lg hover:shadow-emerald-500/5">
      <div className={`absolute left-0 top-0 h-full w-1 ${style.bar}`} />
      <div className="space-y-3 pl-4">
        <div className="flex items-center gap-2">
          <span className={style.label}>{style.icon}</span>
          <span className={`text-xs font-medium uppercase tracking-wider ${style.label}`}>
            {slide.eyebrow}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{slide.title}</p>
        <p className="text-3xl font-bold font-mono tracking-tight">{slide.figure}</p>
        <p className="text-sm text-muted-foreground">{slide.detail}</p>
      </div>
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-medium">{q}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="pb-4 text-sm text-muted-foreground">
          {a}
        </div>
      )}
    </div>
  )
}

function SectionHeading({ label, title, description }: { label?: string; title: string; description?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {label && (
        <Badge variant="outline" className="mb-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          {label}
        </Badge>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function LandingPage() {
  return (
    <>
      {/* ──────── Hero ──────── */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-transparent to-orange-500/5" />
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="space-y-8">
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Zap className="mr-1 size-3" />
                AI-powered data analysis
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                Turn your data into{" "}
                <span className="text-emerald-600 dark:text-emerald-400">actionable insights</span>
              </h1>
              <p className="max-w-xl text-lg text-muted-foreground">
                Upload CSV, Excel, or JSON files and get AI-generated analysis — trend detection, 
                KPI summaries, risk flags, and recommendations. No data science degree required.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                    Get started free
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button size="lg" variant="outline">
                    <Globe className="mr-2 size-4" />
                    Explore reports
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  No credit card
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  Free tier available
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {heroSlides.map((slide, i) => (
                <InsightCard key={i} slide={slide} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ──────── Stats ──────── */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── Features ──────── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            label="Features"
            title="Everything you need to understand your data"
            description="From file upload to AI-powered insights — all in one place."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group rounded-xl border bg-card p-6 transition-all hover:shadow-md hover:shadow-emerald-500/5"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400">
                  {feature.icon}
                </div>
                <h3 className="mt-4 font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── How it works ──────── */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            label="How it works"
            title="Four steps to insights"
            description="No setup, no configuration. Upload and go."
          />
          <div className="mt-12 grid gap-8 md:grid-cols-4">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center">
                <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-600/10 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {step.n}
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+2rem)] top-7 hidden h-px w-[calc(100%-4rem)] border-t border-dashed border-border md:block" />
                )}
                <h3 className="mt-4 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── File Types ──────── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            label="Supported formats"
            title="Bring your data as-is"
            description="No need to convert or reformat. We handle the messy parts."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {fileTypes.map((ft, i) => (
              <div
                key={i}
                className="flex flex-col items-center rounded-xl border bg-card p-8 text-center transition-all hover:shadow-md"
              >
                <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400">
                  {ft.icon}
                </div>
                <h3 className="mt-4 text-xl font-bold">{ft.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{ft.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── Testimonials ──────── */}
      <section className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            label="Testimonials"
            title="Loved by data teams"
            description="Hear from people who use DataNav AI every day."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-xl border bg-card p-6">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-emerald-600/10 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">&ldquo;{t.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── FAQ ──────── */}
      <section className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
          <SectionHeading
            label="FAQ"
            title="Frequently asked questions"
          />
          <div className="mt-12">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ──────── CTA ──────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800" />
        <div className="absolute inset-0 opacity-10">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to turn your data into insights?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-100">
            Join thousands of analysts and decision-makers who use DataNav AI to understand their data faster.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" variant="secondary" className="bg-white text-emerald-800 hover:bg-emerald-50">
                Get started free
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="border-emerald-400 text-white hover:bg-emerald-500/20">
                <Globe className="mr-2 size-4" />
                Explore reports
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
