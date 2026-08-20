"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { SectionHeading } from "./section-heading";
import type { GalleryImage, ContentMap } from "@/lib/types";

export function GallerySection({
  images,
  content,
}: {
  images: GalleryImage[];
  content: ContentMap;
}) {
  const [active, setActive] = useState<GalleryImage | null>(null);
  
  // Early return if no images exist
  if (images.length === 0) return null;

  return (
    <section id="gallery" className="border-b border-pub-border py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          index="08"
          eyebrow="GALLERY"
          heading={content.heading || "Gallery"}
          subheading={content.subheading}
        />

        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {images.map((img, i) => (
            <motion.button
              key={img.id}
              type="button"
              onClick={() => setActive(img)}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 9) * 0.04 }}
              className="group relative block w-full overflow-hidden rounded-xl border border-pub-border bg-pub-surface-2"
            >
              <Image
                src={img.url}
                alt={img.altText || img.caption || "Gallery image"}
                width={480}
                height={360}
                unoptimized // ✅ Kept this as it likely uses a CDN/External URL
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 text-start text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                  {img.caption}
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* ✅ Lightbox Modal */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
          >
            {/* ✅ Added onClick(e) to prevent closing when clicking the backdrop logic inside the button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation(); // Prevent this from hitting the backdrop
                setActive(null);
              }}
              aria-label="Close gallery preview"
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
            >
              <X size={18} />
            </button>
            
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[85vh] max-w-4xl"
            >
              <Image
                src={active.url}
                alt={active.altText || active.caption || "Gallery image"}
                width={1200}
                height={900}
                unoptimized // ✅ Kept this to match the external image behavior
                className="max-h-[85vh] w-auto rounded-xl object-contain"
              />
              {active.caption && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-center text-sm text-white/80"
                >
                  {active.caption}
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}