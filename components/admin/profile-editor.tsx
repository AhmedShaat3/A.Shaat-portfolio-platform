"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Field, Input, Textarea, Button } from "./ui/fields";
import { TagListEditor } from "./ui/tag-list-editor";
import { RichTextEditor } from "./ui/rich-text-editor";
import { ImageUploader } from "./ui/image-uploader";
import { updateProfile, updateProfileImages } from "@/lib/actions/admin/content";
import type { Profile } from "@/lib/types";

export function ProfileEditor({ profile }: { profile: Profile | null }) {
  const [form, setForm] = useState({
    fullName: profile?.fullName ?? "",
    title: profile?.title ?? "",
    tagline: profile?.tagline ?? "",
    typingPhrases: profile?.typingPhrases ? JSON.parse(profile.typingPhrases) : [],
    bio: profile?.bio ?? "",
    mission: profile?.mission ?? "",
    values: profile?.values ? JSON.parse(profile.values) : [],
    email: profile?.email ?? "",
    phone: profile?.phone ?? "",
    location: profile?.location ?? "",
    githubUrl: profile?.githubUrl ?? "",
    linkedinUrl: profile?.linkedinUrl ?? "",
    twitterUrl: profile?.twitterUrl ?? "",
    mapEmbedUrl: profile?.mapEmbedUrl ?? "",
  });
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl ?? "");
  const [resumeUrl, setResumeUrl] = useState(profile?.resumeUrl ?? "");
  const [pending, startTransition] = useTransition();

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function save() {
    startTransition(async () => {
      const [r1, r2] = await Promise.all([
        updateProfile(form),
        updateProfileImages({ avatarUrl, resumeUrl }),
      ]);
      if (!r1.ok) {
        toast.error(r1.error || "Save failed.");
        return;
      }
      if (!r2.ok) {
        toast.error(r2.error || "Save failed.");
        return;
      }
      toast.success("Changes saved.");
    });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full Name" required>
          <Input value={form.fullName} onChange={(e) => set("fullName", e.target.value)} />
        </Field>
        <Field label="Title" hint='e.g. "Cybersecurity • AI • Software Engineering"' required>
          <Input value={form.title} onChange={(e) => set("title", e.target.value)} />
        </Field>
      </div>

      <Field label="Tagline">
        <Textarea rows={2} value={form.tagline} onChange={(e) => set("tagline", e.target.value)} />
      </Field>

      <Field label="Typing Phrases" hint="Rotates in the hero terminal line">
        <TagListEditor
          values={form.typingPhrases}
          onChange={(v) => set("typingPhrases", v)}
          placeholder="Add phrase and press Enter"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Profile Photo">
          <ImageUploader value={avatarUrl} onChange={setAvatarUrl} folder="profile" />
        </Field>
        <Field label="Resume / CV (PDF)">
          <ImageUploader value={resumeUrl} onChange={setResumeUrl} folder="cv" accept="application/pdf" />
        </Field>
      </div>

      <Field label="Biography">
        <RichTextEditor value={form.bio} onChange={(v) => set("bio", v)} />
      </Field>

      <Field label="Mission Statement">
        <Textarea rows={2} value={form.mission} onChange={(e) => set("mission", e.target.value)} />
      </Field>

      <Field label="Values">
        <TagListEditor values={form.values} onChange={(v) => set("values", v)} />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Email">
          <Input value={form.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="Phone">
          <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="Location">
          <Input value={form.location} onChange={(e) => set("location", e.target.value)} />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="GitHub URL">
          <Input value={form.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} />
        </Field>
        <Field label="LinkedIn URL">
          <Input value={form.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} />
        </Field>
        <Field label="Twitter/X URL">
          <Input value={form.twitterUrl} onChange={(e) => set("twitterUrl", e.target.value)} />
        </Field>
      </div>

      <Field label="Map Embed URL" hint="Google Maps embed iframe URL">
        <Input value={form.mapEmbedUrl} onChange={(e) => set("mapEmbedUrl", e.target.value)} />
      </Field>

      <Button type="button" onClick={save} disabled={pending}>
        {pending ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
