"use client";

import { EntityManager } from "./ui/entity-manager";
import { Field, Input, Textarea, Switch } from "./ui/fields";
import { ImageUploader } from "./ui/image-uploader";
import {
  createCertificate,
  updateCertificate,
  deleteCertificate,
  reorderCertificates,
} from "@/lib/actions/admin/certificates";
import type { Certificate } from "@/lib/types";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function CertificatesManager({ items }: { items: Certificate[] }) {
  return (
    <EntityManager<Certificate>
      items={items}
      entityLabel="Certificate"
      actions={{
        create: createCertificate,
        update: updateCertificate,
        remove: deleteCertificate,
        reorder: reorderCertificates,
      }}
      emptyDefaults={{
        slug: "",
        title: "",
        organization: "",
        date: new Date().toISOString().slice(0, 10),
        description: "",
        featured: false,
        order: items.length,
        published: true,
      }}
      renderItem={(item) => ({
        title: item.title,
        subtitle: `${item.organization}${item.published ? "" : " · Draft"}`,
      })}
      renderForm={(value, setValue) => (
        <>
          <Field label="Title" required>
            <Input
              value={value.title ?? ""}
              onChange={(e) => {
                const title = e.target.value;
                setValue({
                  ...value,
                  title,
                  slug: value.slug && value.id ? value.slug : slugify(title),
                });
              }}
            />
          </Field>
          <Field label="Slug" required>
            <Input value={value.slug ?? ""} onChange={(e) => setValue({ ...value, slug: slugify(e.target.value) })} />
          </Field>
          <Field label="Issuing Organization" required>
            <Input
              value={value.organization ?? ""}
              onChange={(e) => setValue({ ...value, organization: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date" required>
              <Input type="date" value={value.date ?? ""} onChange={(e) => setValue({ ...value, date: e.target.value })} />
            </Field>
            <Field label="Certificate ID">
              <Input
                value={value.certificateId ?? ""}
                onChange={(e) => setValue({ ...value, certificateId: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Verification URL">
            <Input
              value={value.verificationUrl ?? ""}
              onChange={(e) => setValue({ ...value, verificationUrl: e.target.value })}
            />
          </Field>
          <Field label="Certificate Image">
            <ImageUploader
              value={value.imageUrl ?? ""}
              onChange={(url) => setValue({ ...value, imageUrl: url })}
              folder="certificates"
            />
          </Field>
          <Field label="Certificate PDF">
            <ImageUploader
              value={value.pdfUrl ?? ""}
              onChange={(url) => setValue({ ...value, pdfUrl: url })}
              folder="certificates"
              accept="application/pdf"
            />
          </Field>
          <Field label="Description">
            <Textarea
              rows={3}
              value={value.description ?? ""}
              onChange={(e) => setValue({ ...value, description: e.target.value })}
            />
          </Field>
          <Switch
            checked={value.featured ?? false}
            onChange={(v) => setValue({ ...value, featured: v })}
            label="Featured"
          />
          <Switch
            checked={value.published ?? true}
            onChange={(v) => setValue({ ...value, published: v })}
            label="Published (visible on public site)"
          />
        </>
      )}
    />
  );
}
