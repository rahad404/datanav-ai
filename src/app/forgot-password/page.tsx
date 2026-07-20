"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, Mail, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/forget-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to send reset email");
      }

      setSent(true);
      toast.success("Check your email for reset instructions");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4">
      <Link
        href="/login"
        className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to login
      </Link>

      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Forgot password</h1>
        <p className="text-muted-foreground">
          {sent
            ? "Reset link sent! Check your inbox."
            : "Enter your email and we&apos;ll send you a reset link"}
        </p>
      </div>

      {sent ? (
        <div className="rounded-xl border bg-card p-8 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 mb-4">
            <Mail className="size-6" />
          </div>
          <p className="text-sm text-muted-foreground">
            If an account exists with that email, you&apos;ll receive password reset instructions shortly.
          </p>
          <Link href="/login">
            <Button variant="outline" className="mt-6">Return to login</Button>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full h-11 bg-emerald-600 hover:bg-emerald-700"
            disabled={isLoading}
          >
            <Send className="mr-2 size-4" />
            {isLoading ? "Sending..." : "Send reset link"}
          </Button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Remember your password?{" "}
        <Link href="/login" className="font-medium text-emerald-600 hover:underline dark:text-emerald-400">
          Sign in
        </Link>
      </p>
    </div>
  );
}
