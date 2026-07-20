"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { User, Upload, X, ArrowLeft, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient, useSession } from "@/lib/auth-client";
import { uploadImageToImgBB, validateImageFile } from "@/lib/image-upload";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, refetch } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || "");
      setEmail(session.user.email || "");
    }
  }, [session]);

  if (!session) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Sign in to edit your profile</h1>
        <p className="mt-2 text-muted-foreground">You need to be logged in to manage your profile.</p>
        <Link href="/login?callbackUrl=/profile">
          <Button className="mt-6">Sign in</Button>
        </Link>
      </div>
    );
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      toast.error(validation.error!);
      return;
    }

    setProfileImage(file);
    const reader = new FileReader();
    reader.onload = () => setProfileImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  function clearImage() {
    setProfileImage(null);
    setProfileImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave() {
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    setIsSaving(true);

    try {
      let imageUrl: string | undefined;

      if (profileImage) {
        setIsUploadingImage(true);
        try {
          imageUrl = await uploadImageToImgBB(profileImage);
        } catch {
          toast.error("Failed to upload profile image");
          setIsUploadingImage(false);
          setIsSaving(false);
          return;
        }
        setIsUploadingImage(false);
      }

      await authClient.updateUser({
        name: name.trim(),
        ...(imageUrl ? { image: imageUrl } : {}),
      });

      await refetch();
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  }

  const user = session.user;
  const currentImage = profileImagePreview || user.image || undefined;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>

      <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
      <p className="mt-1 text-muted-foreground">
        Manage your account settings and profile picture
      </p>

      <div className="mt-8 space-y-8">
        {/* Avatar section */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="size-20 rounded-full">
              <AvatarImage src={currentImage} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name?.[0]?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            {profileImagePreview && (
              <button
                type="button"
                onClick={clearImage}
                className="absolute -top-1 -right-1 flex size-6 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
          <div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mr-2 size-4" />
              Change photo
            </Button>
            <p className="mt-1 text-xs text-muted-foreground">
              JPG, PNG or WebP. Max 5MB.
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>
        </div>

        <Separator />

        {/* Form fields */}
        <div className="space-y-5 max-w-md">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              disabled
              className="h-11 bg-muted"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed. Contact support if needed.
            </p>
          </div>

          <div className="space-y-2">
            <Label>Account type</Label>
            <Input
              value={user.role === "admin" ? "Admin" : "User"}
              disabled
              className="h-11 bg-muted capitalize"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving || isUploadingImage}
            className="bg-success hover:bg-success/90"
          >
            {isUploadingImage ? (
              "Uploading image..."
            ) : isSaving ? (
              "Saving..."
            ) : (
              <>
                <Save className="mr-2 size-4" />
                Save changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
