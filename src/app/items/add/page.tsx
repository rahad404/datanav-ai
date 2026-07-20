"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { reportsApi, analysisApi } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

const categories = [
  { value: "sales", label: "Sales" },
  { value: "finance", label: "Finance" },
  { value: "marketing", label: "Marketing" },
  { value: "operations", label: "Operations" },
  { value: "other", label: "Other" },
];

export default function NewAnalysisPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("other");
  const [isPublic, setIsPublic] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!session) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Sign in to create an analysis</h1>
        <p className="mt-2 text-muted-foreground">You need to be logged in to upload files and run analyses.</p>
        <Link href="/login?callbackUrl=/items/add">
          <Button className="mt-6">Sign in</Button>
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("category", category);
      formData.append("isPublic", String(isPublic));

      const report = await reportsApi.create(formData);
      toast.success("Report uploaded successfully");

      analysisApi.trigger(report._id, "quick").catch(() => {
        // Analysis will be available shortly
      });

      router.push(`/reports/${report._id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to upload report");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/items/manage"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to my reports
      </Link>

      <h1 className="text-3xl font-bold tracking-tight">New Analysis</h1>
      <p className="mt-1 text-muted-foreground">
        Upload a data file and let AI analyze it
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div className="space-y-2">
          <Label>Data File</Label>
          <FileDropzone file={file} onFileSelect={setFile} onClear={() => setFile(null)} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            placeholder="e.g. Q4 Sales Analysis"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Briefly describe what this data represents..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category" className="h-11">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end pb-2">
            <div className="flex items-center gap-3">
              <Switch id="public" checked={isPublic} onCheckedChange={setIsPublic} />
              <Label htmlFor="public" className="cursor-pointer">
                Make this report public
              </Label>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="w-full bg-success hover:bg-success/90"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            "Uploading..."
          ) : (
            <>
              Upload & Analyze
              <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
