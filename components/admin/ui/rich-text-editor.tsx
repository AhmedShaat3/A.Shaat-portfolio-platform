"use client";

import { useRef } from "react";
import {
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

function ToolbarButton({
  icon: Icon,
  onClick,
  label,
}: {
  icon: React.ComponentType<{ size?: number }>;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // keep selection when clicking
      onClick={onClick}
      aria-label={label}
      title={label}
      className="flex h-8 w-8 items-center justify-center rounded-md text-adm-text-muted hover:bg-adm-surface-2 hover:text-adm-text"
    >
      <Icon size={15} />
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function exec(command: string, arg?: string) {
    document.execCommand(command, false, arg);
    ref.current?.focus();
    onChange(ref.current?.innerHTML ?? "");
  }

  function insertLink() {
    const url = window.prompt("Enter URL");
    if (url) exec("createLink", url);
  }

  return (
    <div className="overflow-hidden rounded-lg border border-adm-border">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-adm-border bg-adm-surface-2 px-2 py-1">
        <ToolbarButton icon={Bold} label="Bold" onClick={() => exec("bold")} />
        <ToolbarButton icon={Italic} label="Italic" onClick={() => exec("italic")} />
        <ToolbarButton
          icon={Heading2}
          label="Heading"
          onClick={() => exec("formatBlock", "<h3>")}
        />
        <ToolbarButton
          icon={List}
          label="Bulleted list"
          onClick={() => exec("insertUnorderedList")}
        />
        <ToolbarButton
          icon={ListOrdered}
          label="Numbered list"
          onClick={() => exec("insertOrderedList")}
        />
        <ToolbarButton icon={LinkIcon} label="Link" onClick={insertLink} />
        <ToolbarButton
          icon={Quote}
          label="Quote"
          onClick={() => exec("formatBlock", "<blockquote>")}
        />
        <ToolbarButton
          icon={Code}
          label="Code"
          onClick={() => exec("formatBlock", "<pre>")}
        />
        <span className="mx-1 h-4 w-px bg-adm-border" />
        <ToolbarButton icon={AlignLeft} label="Align left" onClick={() => exec("justifyLeft")} />
        <ToolbarButton
          icon={AlignCenter}
          label="Align center"
          onClick={() => exec("justifyCenter")}
        />
        <ToolbarButton
          icon={AlignRight}
          label="Align right"
          onClick={() => exec("justifyRight")}
        />
      </div>
      <div
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => onChange(ref.current?.innerHTML ?? "")}
        dangerouslySetInnerHTML={{ __html: value }}
        className="prose-content min-h-[160px] max-w-none px-3.5 py-3 text-sm text-adm-text outline-none"
      />
    </div>
  );
}
