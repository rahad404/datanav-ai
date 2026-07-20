import { Compass, Brain, BarChart3, Shield, Users, Zap } from "lucide-react";

const values = [
  { icon: Brain, title: "Clarity over complexity", description: "Data is messy. We turn it into clear, actionable insights anyone can understand." },
  { icon: Zap, title: "Speed matters", description: "From upload to insights in under a minute. No waiting, no setup." },
  { icon: Shield, title: "Your data is yours", description: "We never train on your data. Files are processed privately and never shared." },
  { icon: Users, title: "Built for teams", description: "Share public reports, collaborate on insights, and keep everyone aligned." },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Hero */}
      <div className="text-center mb-16">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-600/10 mx-auto mb-6">
          <Compass className="size-7 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">About DataNav AI</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          We believe every decision-maker deserves fast, clear, and trustworthy data analysis — 
          without needing a data science degree or a dedicated analytics team.
        </p>
      </div>

      {/* Story */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-4">Our Story</h2>
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p>
            DataNav AI was born from a simple observation: most teams spend 80% of their time 
            preparing data and only 20% actually analyzing it. That ratio is backwards.
          </p>
          <p>
            We built DataNav AI to flip it. Upload your CSV, Excel, or JSON files directly — 
            and get a structured, AI-powered analysis in seconds. Trends, KPIs, risk flags, 
            and recommendations, all in one place.
          </p>
          <p>
            What started as an internal tool for our own data workflows became a platform 
            used by teams across industries — from retail operations to early-stage startups.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">What We Believe</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {values.map((v, i) => (
            <div key={i} className="rounded-xl border bg-card p-6">
              <div className="flex size-10 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 mb-4">
                <v.icon className="size-5" />
              </div>
              <h3 className="font-semibold mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="rounded-xl border bg-emerald-600/5 p-8 text-center">
        <BarChart3 className="size-8 text-emerald-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Our Mission</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          To make structured data analysis as simple as asking a question — 
          and to put AI-powered insights in the hands of every decision-maker, 
          regardless of technical background.
        </p>
      </div>
    </div>
  );
}
