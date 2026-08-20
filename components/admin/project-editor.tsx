"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowLeft, Save, Plus, X, Star, ExternalLink } from "lucide-react";
import { GithubIcon } from "@/components/public/brand-icons";
import { Field, Input, Textarea, Select, Switch, Button } from "./ui/fields";
import { RichTextEditor } from "./ui/rich-text-editor";
import { TagListEditor } from "./ui/tag-list-editor";
import { ImageUploader } from "./ui/image-uploader";
import { createProject, updateProject } from "@/lib/actions/admin/projects";
// ✅ التغيير 1: استيراد AdminProject بدلاً من Project
import type { AdminProject } from "@/lib/types";

const CATEGORIES = [
  "Cybersecurity",
  "AI",
  "Machine Learning",
  "DevOps",
  "Cloud",
  "Web Development",
  "Networking",
  "Automation",
  "Other",
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

interface FormState {
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  category: string;
  technologies: string[];
  mainImageUrl: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  status: "completed" | "in-progress" | "archived";
  stats: { label: string; value: string }[];
  challenges: string;
  solution: string;
  results: string;
  seoTitle: string;
  seoDescription: string;
  order: number;
  published: boolean;
}

// ✅ التغيير 2: تعديل دالة fromProject لتقبل AdminProject
function fromProject(p?: AdminProject): FormState {
  // تحويل technologies من نص (string) إلى مصفوفة (string[]) بأمان
  let technologies: string[] = [];
  if (p?.technologies) {
    try { technologies = JSON.parse(p.technologies); } catch { technologies = []; }
  }

  // تحويل stats من نص (string) إلى مصفوفة (array) بأمان
  let stats: { label: string; value: string }[] = [];
  if (p?.stats) {
    try { stats = JSON.parse(p.stats); } catch { stats = []; }
  }

  return {
    title: p?.title ?? "",
    slug: p?.slug ?? "",
    shortDescription: p?.shortDescription ?? "",
    fullDescription: p?.fullDescription ?? "",
    category: p?.category ?? CATEGORIES[0],
    technologies, // استخدام القيمة المحولة
    mainImageUrl: p?.mainImageUrl ?? "",
    githubUrl: p?.githubUrl ?? "",
    liveUrl: p?.liveUrl ?? "",
    featured: p?.featured ?? false,
    status: (p?.status as FormState["status"]) ?? "completed",
    stats, // استخدام القيمة المحولة
    challenges: p?.challenges ?? "",
    solution: p?.solution ?? "",
    results: p?.results ?? "",
    seoTitle: p?.seoTitle ?? "",
    seoDescription: p?.seoDescription ?? "",
    order: p?.order ?? 0,
    published: p?.published ?? false,
  };
}

// ✅ التغيير 3: تعديل دالة props لتقبل AdminProject
export function ProjectEditor({ project }: { project?: AdminProject }) {
  const [form, setForm] = useState<FormState>(fromProject(project));
  const [slugTouched, setSlugTouched] = useState(!!project);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const isNew = !project;

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleTitleChange(title: string) {
    set("title", title);
    if (!slugTouched) set("slug", slugify(title));
  }

  function save(publish?: boolean) {
    // ✅ التغيير 4: تحويل المصفوفات إلى نصوص JSON قبل إرسالها للخادم
    const payload = { 
      ...form, 
      published: publish ?? form.published,
      technologies: JSON.stringify(form.technologies), // إعادة تحويلها لنص
      stats: JSON.stringify(form.stats),               // إعادة تحويلها لنص
    };

    startTransition(async () => {
      const result = isNew
        ? await createProject(payload)
        : await updateProject(project!.id, payload);
      if (!result.ok) {
        toast.error(result.error || "Something went wrong.");
        return;
      }
      toast.success(
        publish === true
          ? "Portfolio published successfully."
          : isNew
            ? "Project created."
            : "Changes saved."
      );
      router.push("/admin/projects");
      router.refresh();
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => router.push("/admin/projects")}
        className="mb-4 flex items-center gap-1.5 text-sm text-adm-text-muted hover:text-adm-text"
      >
        <ArrowLeft size={14} /> Back to Projects
      </button>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* EDITOR */}
        <div className="space-y-4">
          <Field label="Title" required>
            <Input value={form.title} onChange={(e) => handleTitleChange(e.target.value)} />
          </Field>
          <Field label="Slug" hint="Used in the URL: /projects/your-slug" required>
            <Input
              value={form.slug}
              onChange={(e) => {
                setSlugTouched(true);
                set("slug", slugify(e.target.value));
              }}
            />
          </Field>
          <Field label="Category" required>
            <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Status">
            <Select
              value={form.status}
              onChange={(e) => set("status", e.target.value as FormState["status"])}
            >
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="archived">Archived</option>
            </Select>
          </Field>
          <Field label="Short Description" hint="Shown in project cards">
            <Textarea
              rows={2}
              value={form.shortDescription}
              onChange={(e) => set("shortDescription", e.target.value)}
            />
          </Field>
          <Field label="Main Image">
            <ImageUploader
              value={form.mainImageUrl}
              onChange={(url) => set("mainImageUrl", url)}
              folder="projects"
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="GitHub URL">
              <Input value={form.githubUrl} onChange={(e) => set("githubUrl", e.target.value)} />
            </Field>
            <Field label="Live Demo URL">
              <Input value={form.liveUrl} onChange={(e) => set("liveUrl", e.target.value)} />
            </Field>
          </div>
          <Field label="Technologies">
            <TagListEditor values={form.technologies} onChange={(v) => set("technologies", v)} />
          </Field>

          <Field label="Full Description">
            <RichTextEditor value={form.fullDescription} onChange={(v) => set("fullDescription", v)} />
          </Field>
          <Field label="The Challenge">
            <RichTextEditor value={form.challenges} onChange={(v) => set("challenges", v)} />
          </Field>
          <Field label="The Solution">
            <RichTextEditor value={form.solution} onChange={(v) => set("solution", v)} />
          </Field>
          <Field label="The Results">
            <RichTextEditor value={form.results} onChange={(v) => set("results", v)} />
          </Field>

          <div>
            <span className="mb-1.5 block text-xs font-medium text-adm-text-muted">Stats</span>
            <div className="space-y-2">
              {form.stats.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    placeholder="Label (e.g. Users)"
                    value={s.label}
                    onChange={(e) => {
                      const next = [...form.stats];
                      next[i] = { ...next[i], label: e.target.value };
                      set("stats", next);
                    }}
                  />
                  <Input
                    placeholder="Value (e.g. 500+)"
                    value={s.value}
                    onChange={(e) => {
                      const next = [...form.stats];
                      next[i] = { ...next[i], value: e.target.value };
                      set("stats", next);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => set("stats", form.stats.filter((_, idx) => idx !== i))}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-adm-text-muted hover:bg-red-50 hover:text-adm-danger"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => set("stats", [...form.stats, { label: "", value: "" }])}
                className="flex items-center gap-1.5 text-xs text-adm-accent hover:underline"
              >
                <Plus size={12} /> Add stat
              </button>
            </div>
          </div>

          <Field label="SEO Title">
            <Input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} />
          </Field>
          <Field label="SEO Description">
            <Textarea rows={2} value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} />
          </Field>

          <div className="flex items-center gap-6 rounded-lg border border-adm-border p-3">
            <Switch checked={form.featured} onChange={(v) => set("featured", v)} label="Featured" />
          </div>

          <div className="sticky bottom-0 flex flex-wrap gap-2 border-t border-adm-border bg-adm-bg pt-4">
            <Button type="button" variant="secondary" onClick={() => save(false)} disabled={pending}>
              <Save size={15} /> Save Draft
            </Button>
            <Button type="button" onClick={() => save(true)} disabled={pending}>
              {pending ? "Publishing..." : "Publish"}
            </Button>
          </div>
        </div>

        {/* LIVE PREVIEW */}
        <div className="lg:sticky lg:top-20 lg:self-start">
          <p className="mb-2 font-mono text-xs uppercase tracking-widest text-adm-text-muted">
            Live Preview
          </p>
          <div className="pub-scope overflow-hidden rounded-2xl border border-adm-border bg-pub-bg">
            <div className="max-h-[75vh] overflow-y-auto p-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-pub-accent/40 bg-pub-accent/10 px-3 py-1 font-mono text-xs text-pub-accent">
                  {form.category}
                </span>
                {form.featured && (
                  <span className="flex items-center gap-1 rounded-full bg-pub-accent px-2.5 py-1 font-mono text-[10px] font-semibold text-black">
                    <Star size={10} fill="black" /> Featured
                  </span>
                )}
              </div>
              <h1 className="mt-4 font-display text-2xl font-bold text-pub-text">
                {form.title || "Untitled Project"}
              </h1>
              {form.shortDescription && (
                <p className="mt-2 text-sm text-pub-text-muted">{form.shortDescription}</p>
              )}
              <div className="mt-4 flex gap-2">
                {form.liveUrl && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-pub-accent px-3 py-1.5 text-xs font-semibold text-black">
                    <ExternalLink size={12} /> Live Demo
                  </span>
                )}
                {form.githubUrl && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-pub-border px-3 py-1.5 text-xs text-pub-text">
                    <GithubIcon size={12} /> Source
                  </span>
                )}
              </div>
              {form.mainImageUrl && (
                <div className="relative mt-5 aspect-video w-full overflow-hidden rounded-xl border border-pub-border bg-pub-surface-2">
                  <Image src={form.mainImageUrl} alt="" fill className="object-cover" />
                </div>
              )}
              {form.technologies.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-1.5">
                  {form.technologies.map((t) => (
                    <span
                      key={t}
                      className="rounded-md border border-pub-border bg-pub-surface-2 px-2 py-0.5 font-mono text-[10px] text-pub-text-muted"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}
              {form.fullDescription && (
                <div
                  className="prose-content mt-6 text-sm text-pub-text-muted"
                  dangerouslySetInnerHTML={{ __html: form.fullDescription }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}