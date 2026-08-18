"use client";

import { EntityManager } from "./ui/entity-manager";
import { Field, Input, Textarea, Switch } from "./ui/fields";
import { ImageUploader } from "./ui/image-uploader";
import {
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials,
} from "@/lib/actions/admin/testimonials";
import type { Testimonial } from "@/lib/types";

export function TestimonialsManager({ items }: { items: Testimonial[] }) {
  return (
    <EntityManager<Testimonial>
      items={items}
      entityLabel="Testimonial"
      actions={{
        create: createTestimonial,
        update: updateTestimonial,
        remove: deleteTestimonial,
        reorder: reorderTestimonials,
      }}
      emptyDefaults={{
        person: "",
        position: "",
        company: "",
        quote: "",
        rating: 5,
        isPlaceholder: false,
        order: items.length,
        visible: true,
      }}
      renderItem={(item) => ({
        title: item.person,
        subtitle: item.isPlaceholder ? "Placeholder — replace before publishing" : item.company ?? undefined,
      })}
      renderForm={(value, setValue) => (
        <>
          {value.isPlaceholder && (
            <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-adm-warning">
              This is placeholder content. Edit it with a real testimonial, then it will
              stop being marked as a placeholder once you save.
            </p>
          )}
          <Field label="Person's Name" required>
            <Input value={value.person ?? ""} onChange={(e) => setValue({ ...value, person: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Position">
              <Input
                value={value.position ?? ""}
                onChange={(e) => setValue({ ...value, position: e.target.value })}
              />
            </Field>
            <Field label="Company">
              <Input
                value={value.company ?? ""}
                onChange={(e) => setValue({ ...value, company: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Photo">
            <ImageUploader
              value={value.photoUrl ?? ""}
              onChange={(url) => setValue({ ...value, photoUrl: url })}
              folder="other"
            />
          </Field>
          <Field label="Quote" required>
            <Textarea rows={3} value={value.quote ?? ""} onChange={(e) => setValue({ ...value, quote: e.target.value })} />
          </Field>
          <Field label={`Rating: ${value.rating ?? 5} / 5`}>
            <input
              type="range"
              min={1}
              max={5}
              value={value.rating ?? 5}
              onChange={(e) => setValue({ ...value, rating: Number(e.target.value) })}
              className="w-full accent-adm-accent"
            />
          </Field>
          <Switch
            checked={!(value.isPlaceholder ?? false)}
            onChange={(v) => setValue({ ...value, isPlaceholder: !v })}
            label="This is real testimonial content (not a placeholder)"
          />
          <Switch
            checked={value.visible ?? true}
            onChange={(v) => setValue({ ...value, visible: v })}
            label="Visible on public site"
          />
        </>
      )}
    />
  );
}
