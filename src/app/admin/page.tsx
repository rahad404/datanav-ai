"use client";

import { Shield } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const { data: session } = useSession();

  if (!session) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Sign in to access admin</h1>
        <p className="mt-2 text-muted-foreground">Admin access requires authentication.</p>
        <Link href="/login?callbackUrl=/admin">
          <Button className="mt-6">Sign in</Button>
        </Link>
      </div>
    );
  }

  const isAdmin = session.user.role === "admin";

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <Shield className="mx-auto size-12 text-muted-foreground/40 mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="mt-2 text-muted-foreground">You do not have admin permissions.</p>
        <Link href="/dashboard">
          <Button variant="outline" className="mt-6">Go to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Manage users and platform settings</p>
      </div>
      <div className="rounded-xl border bg-card p-8 text-center">
        <Shield className="mx-auto size-12 text-emerald-500 mb-4" />
        <h2 className="text-xl font-semibold">Admin Panel</h2>
        <p className="mt-2 text-muted-foreground">
          Admin features are under development. Check back soon.
        </p>
      </div>
    </div>
  );
}
