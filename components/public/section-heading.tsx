import { Reveal } from "./reveal";

export function SectionHeading({
  index,
  eyebrow,
  heading,
  subheading,
  align = "left",
}: {
  index?: string;
  eyebrow?: string;
  heading: string;
  subheading?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={align === "center" ? "text-center" : ""}>
      <div
        className={`flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em] text-pub-accent ${
          align === "center" ? "justify-center" : ""
        }`}
      >
        {index && <span className="text-pub-text-faint">{index}</span>}
        <span>{eyebrow ?? heading}</span>
      </div>
      <h2 className="mt-3 font-display text-3xl font-semibold text-pub-text sm:text-4xl">
        {heading}
      </h2>
      {subheading && (
        <p
          className={`mt-3 max-w-2xl text-pub-text-muted ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {subheading}
        </p>
      )}
    </Reveal>
  );
}
