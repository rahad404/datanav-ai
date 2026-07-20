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
  Download,
  Brain,
  Globe,
  Zap,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  Star,
  Target,
  Layers,
  Table,
  RefreshCw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

// ---------------------------------------------------------------------------
// Data & Media Assets
// ---------------------------------------------------------------------------

// Direct image CDN URLs converted from ImageBB links
const heroCarouselImages = [
  {
    url: "https://i.ibb.co/nN8KBLf9/image1.png",
    alt: "AI Analytics Dashboard Preview 1",
    title: "Real-time Metrics",
  },
  {
    url: "https://i.ibb.co/yHY2dJq/image2.png",
    alt: "AI Analytics Dashboard Preview 2",
    title: "Predictive Trends",
  },
  {
    url: "https://i.ibb.co/Fqfs5tJs/image3.png",
    alt: "AI Analytics Dashboard Preview 3",
    title: "Risk Analysis & Monitoring",
  },
  {
    url: "https://i.ibb.co/JwcrDKFd/image4.png",
    alt: "AI Analytics Dashboard Preview 4",
    title: "Automated Reporting",
  },
]

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

const kindStyles: Record<SlideKind, { bar: string; icon: React.ReactNode; color: string }> = {
  trend: { bar: "bg-emerald-500", icon: <TrendingUp className="size-4" />, color: "text-emerald-500" },
  kpi: { bar: "bg-emerald-500", icon: <Minus className="size-4" />, color: "text-emerald-500" },
  risk: { bar: "bg-orange-500", icon: <ShieldAlert className="size-4" />, color: "text-orange-500" },
  recommendation: { bar: "bg-orange-500", icon: <TrendingDown className="size-4" />, color: "text-orange-500" },
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
  { icon: <Table className="size-8" />, name: "XLSX / XLS", note: "First sheet is read; multi-sheet support coming" },
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
    role: "Ops Lead, Mid-size Retailer",
    quote:
      "I stopped exporting the same spreadsheet into five different chart tools. Upload, read, done.",
  },
  {
    name: "Jordan T.",
    role: "Finance, Early-stage Startup",
    quote:
      "The risk callouts caught a churn pattern two weeks before it showed up in our actual numbers.",
  },
  {
    name: "Asha K.",
    role: "Founder, DTC Brand",
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

const extras = [
  { icon: Target, title: "No templates required", description: "Upload any structured file — we auto-detect the schema." },
  { icon: RefreshCw, title: "Regenerate anytime", description: "Re-run analysis with a click when your data changes." },
  { icon: Layers, title: "Multi-category support", description: "Sales, finance, marketing, operations — all in one place." },
]

// ---------------------------------------------------------------------------
// Components
// ---------------------------------------------------------------------------

function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const [display, setDisplay] = React.useState("0")
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const num = parseInt(value.replace(/[^0-9]/g, ""))
            if (isNaN(num)) {
              setDisplay(value)
              return
            }
            let start = 0
            const step = Math.ceil(num / 30)
            const interval = setInterval(() => {
              start += step
              if (start >= num) {
                setDisplay(value)
                clearInterval(interval)
              } else {
                setDisplay(start + suffix)
              }
            }, 40)
            observer.unobserve(el)
          }
        })
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [value, suffix])

  return <span ref={ref}>{display}</span>
}

function InsightCard({ slide, className = "" }: { slide: (typeof heroSlides)[number]; className?: string }) {
  const style = kindStyles[slide.kind]
  return (
    <div className={`group relative overflow-hidden rounded-xl border border-border/60 bg-card/60 backdrop-blur-md p-5 transition-all hover:shadow-xl hover:shadow-emerald-500/10 hover:border-emerald-500/40 ${className}`}>
      <div className={`absolute left-0 top-0 h-full w-1 ${style.bar}`} />
      <div className="space-y-3 pl-4">
        <div className="flex items-center gap-2">
          <span className={style.color}>{style.icon}</span>
          <span className={`text-xs font-medium uppercase tracking-wider ${style.color}`}>
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

function HeroImageCarousel() {
  const [currentIndex, setCurrentIndex] = React.useState(0)

  const handleNext = React.useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % heroCarouselImages.length)
  }, [])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + heroCarouselImages.length) % heroCarouselImages.length)
  }

  React.useEffect(() => {
    const timer = setInterval(() => {
      handleNext()
    }, 4500)
    return () => clearInterval(timer)
  }, [handleNext])

  return (
    <div className="relative mx-auto w-full max-w-2xl group">
      {/* Decorative Outer Glow */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-500/30 via-teal-500/20 to-orange-500/30 blur-xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />

      {/* Main Container */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/80 backdrop-blur-xl shadow-2xl">
        
        {/* Top Window Bar Mockup */}
        <div className="flex items-center justify-between border-b border-border/60 bg-muted/40 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-500/80" />
            <span className="size-3 rounded-full bg-yellow-500/80" />
            <span className="size-3 rounded-full bg-green-500/80" />
          </div>
          <div className="text-xs font-medium text-muted-foreground/80 flex items-center gap-1.5">
            <Sparkles className="size-3.5 text-emerald-500" />
            <span>DataNav AI Live Preview</span>
          </div>
          <Badge variant="secondary" className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            {heroCarouselImages[currentIndex].title}
          </Badge>
        </div>

        {/* Carousel Image Slider */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted/20">
          {heroCarouselImages.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                index === currentIndex
                  ? "opacity-100 scale-100 z-10"
                  : "opacity-0 scale-105 z-0"
              }`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="h-full w-full object-cover object-top"
              />
            </div>
          ))}

          {/* Nav Controls */}
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-border/50 bg-background/70 p-2 text-foreground backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-background hover:scale-110"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-border/50 bg-background/70 p-2 text-foreground backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all hover:bg-background hover:scale-110"
          >
            <ChevronRight className="size-4" />
          </button>

          {/* Floating Live Badge Overlay */}
          <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-2 rounded-lg border border-border/60 bg-background/80 px-3 py-1.5 backdrop-blur-md shadow-md text-xs font-medium">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            <span>AI Model Active</span>
          </div>
        </div>

        {/* Dots Navigation */}
        <div className="flex items-center justify-between border-t border-border/60 bg-muted/20 px-4 py-2.5">
          <p className="text-xs text-muted-foreground font-mono">
            0{currentIndex + 1} / 0{heroCarouselImages.length}
          </p>
          <div className="flex items-center gap-1.5">
            {heroCarouselImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex ? "w-6 bg-emerald-500" : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = React.useState(false)
  const contentRef = React.useRef<HTMLDivElement>(null)

  return (
    <div className="border-b border-border/60 last:border-none">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-emerald-500"
      >
        <span className="font-semibold text-base sm:text-lg">{q}</span>
        <ChevronDown
          className={`size-5 shrink-0 text-muted-foreground transition-transform duration-300 ${
            open ? "rotate-180 text-emerald-500" : ""
          }`}
        />
      </button>
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? contentRef.current?.scrollHeight : 0 }}
      >
        <div ref={contentRef} className="pb-5 text-muted-foreground leading-relaxed">
          {a}
        </div>
      </div>
    </div>
  )
}

function SectionHeading({ label, title, description }: { label?: string; title: string; description?: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      {label && (
        <Badge variant="outline" className="mb-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1">
          {label}
        </Badge>
      )}
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text text-transparent">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function LandingPage() {
  const [activeSlide, setActiveSlide] = React.useState(0)

  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased selection:bg-emerald-500/20 selection:text-emerald-500">
      
      {/* ──────── Modernized Hero Section ──────── */}
      <section className="relative overflow-hidden border-b border-border/60 pt-12 pb-20 lg:pt-20 lg:pb-32">
        {/* Dynamic Glowing Radial Backgrounds */}
        <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-emerald-500/15 via-teal-500/10 to-transparent blur-3xl" />
        <div className="pointer-events-none absolute top-1/2 -right-40 -z-10 size-96 rounded-full bg-emerald-500/10 blur-3xl" />

        {/* Subtle SVG Grid Overlay */}
        <div className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.05]">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#hero-grid)" />
          </svg>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
            
            {/* Left Column: Hero Content */}
            <div className="space-y-8 lg:col-span-6">
              <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 py-1.5 px-3 backdrop-blur-md">
                <Zap className="mr-1.5 size-3.5 fill-emerald-500" />
                AI-powered Data Intelligence
              </Badge>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.1]">
                Turn raw data into{" "}
                <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-300">
                  instant clarity
                </span>
              </h1>

              <p className="max-w-xl text-lg text-muted-foreground leading-relaxed">
                Drop in CSV, Excel, or JSON files. Our AI engine parses the structure, computes statistics, and flags key business insights in under 40 seconds.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-600/20 transition-all hover:shadow-2xl hover:shadow-emerald-600/30 hover:-translate-y-0.5 rounded-xl h-12 px-6">
                    Get started free
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                </Link>
                <Link href="/explore">
                  <Button size="lg" variant="outline" className="rounded-xl border-border/80 h-12 px-6 transition-all hover:bg-accent hover:-translate-y-0.5">
                    <Globe className="mr-2 size-4" />
                    Explore reports
                  </Button>
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-2 border-t border-border/40 grid grid-cols-3 gap-4 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span>No credit card needed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span>Free tier available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                  <span>38s avg turnaround</span>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Image Carousel */}
            <div className="lg:col-span-6">
              <HeroImageCarousel />
            </div>

          </div>
        </div>
      </section>

      {/* ──────── Stats Section ──────── */}
      <section className="border-b border-border/60 bg-muted/20 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl font-extrabold font-mono tracking-tight text-emerald-600 dark:text-emerald-400">
                  <AnimatedCounter value={stat.value} />
                </p>
                <p className="mt-1 text-sm font-medium text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── Sample Insights Cards ──────── */}
      <section className="border-b border-border/60 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Sample Insights"
            title="Structured outputs every time"
            description="Skip messy raw tables. Get trends, KPIs, risks, and next actions delivered in an easy-to-read format."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {heroSlides.map((slide, i) => (
              <InsightCard
                key={i}
                slide={slide}
                className={`transition-all duration-300 ${
                  i === activeSlide ? "ring-2 ring-emerald-500/50 shadow-xl shadow-emerald-500/10 scale-[1.02]" : ""
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ──────── Features Section ──────── */}
      <section className="border-b border-border/60 bg-muted/20 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Features"
            title="Designed for modern analytical workflows"
            description="Everything required to convert raw spreadsheet records into actionable team decisions."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-7 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 hover:border-emerald-500/40"
              >
                <div className="flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white dark:text-emerald-400 dark:group-hover:text-white">
                  {feature.icon}
                </div>
                <h3 className="mt-5 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── How it works ──────── */}
      <section className="border-b border-border/60 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Workflow"
            title="Four simple steps to clarity"
            description="No complex setup, query writing, or manual chart configuration required."
          />
          <div className="mt-16 grid gap-8 md:grid-cols-4">
            {steps.map((step, i) => (
              <div key={i} className="relative text-center group">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-extrabold text-white shadow-lg shadow-emerald-500/20 transition-transform group-hover:scale-110">
                  {step.n}
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute left-[calc(50%+3rem)] top-8 hidden h-0.5 w-[calc(100%-6rem)] bg-border md:block" />
                )}
                <h3 className="mt-5 font-semibold text-base">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── File Types ──────── */}
      <section className="border-b border-border/60 bg-muted/20 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Supported formats"
            title="Bring your raw files directly"
            description="Upload standard data formats — no upfront cleansing or schema building needed."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {fileTypes.map((ft, i) => (
              <div
                key={i}
                className="group flex flex-col items-center rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-8 text-center transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1 hover:border-emerald-500/40"
              >
                <div className="flex size-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white dark:text-emerald-400 dark:group-hover:text-white">
                  {ft.icon}
                </div>
                <h3 className="mt-5 text-xl font-bold">{ft.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{ft.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── Why DataNav AI ──────── */}
      <section className="border-b border-border/60 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Why DataNav AI"
            title="Engineered for real-world business data"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {extras.map((item, i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center backdrop-blur-md">
                <div className="mx-auto flex size-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <item.icon className="size-6" />
                </div>
                <h3 className="mt-5 font-semibold text-base">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── Testimonials ──────── */}
      <section className="border-b border-border/60 bg-muted/20 py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="Testimonials"
            title="Trusted by analysts and operational leads"
            description="Hear how decision-makers save time on weekly reporting."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md p-7 transition-all hover:shadow-lg">
                <div className="flex items-center gap-3.5 mb-5">
                  <img
                    src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=10B981&color=fff&bold=true&size=40`}
                    alt={t.name}
                    className="size-11 rounded-full ring-2 ring-emerald-500/30"
                  />
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="size-4 fill-emerald-500 text-emerald-500" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground italic">&ldquo;{t.quote}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──────── FAQ ──────── */}
      <section className="border-b border-border/60 py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            label="FAQ"
            title="Frequently asked questions"
          />
          <div className="mt-12 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md px-6 sm:px-8 py-2">
            {faqs.map((faq, i) => (
              <FaqItem key={i} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ──────── CTA & Newsletter ──────── */}
      <section className="relative overflow-hidden py-20 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-800 to-slate-900" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Start getting clearer data insights today
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-emerald-100/90 leading-relaxed">
            Join analysts and founders using DataNav AI to skip manual reporting and catch critical operational signals early.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-white text-emerald-900 hover:bg-emerald-50 shadow-2xl rounded-xl h-12 px-7 font-semibold transition-all hover:scale-[1.02]">
                Get started free
                <ArrowRight className="ml-2 size-4" />
              </Button>
            </Link>
            <Link href="/explore">
              <Button size="lg" variant="outline" className="border-emerald-400/40 text-white hover:bg-white/10 rounded-xl h-12 px-7 backdrop-blur-sm transition-all hover:scale-[1.02]">
                <Globe className="mr-2 size-4" />
                Explore reports
              </Button>
            </Link>
          </div>

          {/* Newsletter Box */}
          <div className="mx-auto mt-14 max-w-md rounded-2xl border border-emerald-400/20 bg-white/5 backdrop-blur-md p-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Mail className="size-4 text-emerald-300" />
              <span className="text-sm font-medium text-emerald-100">Stay updated with feature releases</span>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const input = (e.target as HTMLFormElement).querySelector("input")!
                if (input.value) {
                  input.value = ""
                }
              }}
              className="flex gap-2"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                className="h-11 flex-1 border-emerald-400/30 bg-black/20 text-white placeholder:text-emerald-200/50 focus:border-emerald-300 focus:ring-emerald-300 rounded-xl"
                required
              />
              <Button
                type="submit"
                className="h-11 shrink-0 bg-white text-emerald-900 hover:bg-emerald-50 font-semibold rounded-xl px-5"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>

    </div>
  )
}