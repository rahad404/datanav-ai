"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, ExternalLink } from "lucide-react";
import Link from "next/link";

const faqs = [
  {
    q: "What file formats are supported?",
    a: "We support CSV, XLSX, XLS, and JSON files. CSV files can be comma or tab-separated. For Excel files, we read the first sheet by default.",
  },
  {
    q: "Is there a file size limit?",
    a: "Yes, the maximum file size is 10MB per upload. If you have larger datasets, we recommend sampling or splitting them into multiple files.",
  },
  {
    q: "How long does analysis take?",
    a: "Quick analysis typically completes in under 30 seconds. Deep analysis may take up to 2 minutes depending on file size and complexity.",
  },
  {
    q: "Is my data private?",
    a: "Absolutely. Your files are processed to generate your analysis and are never used for training. Private reports are only visible to you.",
  },
  {
    q: "Can I share my reports?",
    a: "Yes. You can mark reports as public when uploading, making them visible on the Explore page. Private reports stay visible only to you.",
  },
  {
    q: "How do I delete a report?",
    a: "Go to My Reports, find the report you want to delete, and click the trash icon. Confirm the deletion in the dialog that appears.",
  },
  {
    q: "Can I re-run analysis?",
    a: "Yes. On the analysis workspace page, click the Regenerate button to re-run the analysis with the latest AI model.",
  },
  {
    q: "What's the difference between Quick and Deep analysis?",
    a: "Quick analysis provides a fast overview of trends, KPIs, and risks. Deep analysis takes more time but provides more detailed insights and recommendations.",
  },
  {
    q: "What AI provider powers the analysis?",
    a: "The backend is configured to use any OpenAI-compatible provider. Your instance could use OpenAI, Google Gemini, Groq, Together AI, or a local Ollama model.",
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between py-4 text-left"
      >
        <span className="font-medium">{q}</span>
        <ChevronDown
          className={`size-4 shrink-0 text-muted-foreground transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <div className="pb-4 text-sm text-muted-foreground leading-relaxed">{a}</div>
      )}
    </div>
  );
}

export default function HelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <div className="flex size-14 items-center justify-center           rounded-2xl bg-success/10 mx-auto mb-6">
          <HelpCircle className="size-7 text-success-text" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Help & FAQ</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Answers to common questions about DataNav AI
        </p>
      </div>

      {/* Search hint */}
      <div className="mb-8 rounded-xl border bg-card p-4 text-sm text-muted-foreground">
        Can&apos;t find what you&apos;re looking for?{" "}
        <Link
          href="/contact"
          className="text-success-text hover:underline"
        >
          Contact our support team
        </Link>
      </div>

      {/* FAQ */}
      <div className="rounded-xl border bg-card p-6">
        {faqs.map((faq, i) => (
          <FaqItem key={i} q={faq.q} a={faq.a} />
        ))}
      </div>

      {/* Quick links */}
      <div className="mt-12">
        <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link
            href="/items/add"
            className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <ExternalLink className="size-4 text-success" />
            <span className="text-sm">How to upload a file</span>
          </Link>
          <Link
            href="/items/manage"
            className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <ExternalLink className="size-4 text-success" />
            <span className="text-sm">Managing your reports</span>
          </Link>
          <Link
            href="/privacy"
            className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <ExternalLink className="size-4 text-success" />
            <span className="text-sm">Privacy policy</span>
          </Link>
          <Link
            href="/terms"
            className="flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:bg-muted/50"
          >
            <ExternalLink className="size-4 text-success" />
            <span className="text-sm">Terms of service</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
