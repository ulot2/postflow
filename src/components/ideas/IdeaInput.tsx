"use client";

import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

type Priority = "hot" | "maybe" | "someday" | undefined;

const PRIORITY_CONFIG = {
  hot: { color: "bg-red-500", ring: "ring-red-200", label: "Hot" },
  maybe: { color: "bg-amber-400", ring: "ring-amber-200", label: "Maybe" },
  someday: {
    color: "bg-emerald-400",
    ring: "ring-emerald-200",
    label: "Someday",
  },
} as const;

interface IdeaInputProps {
  onSubmit: (
    content: string,
    tags: string[],
    priority?: Priority,
  ) => Promise<void>;
}

export function IdeaInput({ onSubmit }: IdeaInputProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [priority, setPriority] = useState<Priority>(undefined);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [content]);

  const handleSubmit = async () => {
    const trimmed = content.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onSubmit(trimmed, tags, priority);
      setShowFlash(true);
      setContent("");
      setTags([]);
      setTagInput("");
      setPriority(undefined);
      setTimeout(() => setShowFlash(false), 400);
    } finally {
      setIsSubmitting(false);
      textareaRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && tagInput === "" && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/,/g, "");
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags((prev) => [...prev, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const cyclePriority = (p: "hot" | "maybe" | "someday") => {
    setPriority((prev) => (prev === p ? undefined : p));
  };

  return (
    <div
      className={`relative bg-white rounded-2xl border border-[#e0dbd3] shadow-sm overflow-hidden transition-all duration-300 ${
        showFlash ? "ring-2 ring-[#d4f24a] ring-offset-2" : ""
      }`}
    >
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Jot down a quick idea..."
        rows={2}
        className="w-full resize-none bg-transparent px-5 pt-5 pb-3 text-[15px] text-[#0f0f0f] placeholder:text-[#b0a99e] focus:outline-none leading-relaxed font-medium"
      />

      {/* Tags Row */}
      <div className="flex flex-wrap items-center gap-2 px-5 pb-3">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#f7f4ef] border border-[#e0dbd3] text-[12px] font-semibold text-[#5a5347]"
          >
            #{tag}
            <button
              onClick={() => removeTag(tag)}
              title={`Remove tag ${tag}`}
              className="text-[#a09a90] hover:text-[#0f0f0f] transition-colors cursor-pointer"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          ref={tagInputRef}
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagKeyDown}
          onBlur={addTag}
          placeholder={tags.length < 5 ? "Add tag..." : ""}
          disabled={tags.length >= 5}
          className="text-[12px] text-[#0f0f0f] placeholder:text-[#c5bfb5] bg-transparent focus:outline-none w-20 font-medium"
        />
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between px-5 pb-4">
        <div className="flex items-center gap-4">
          {/* Priority Selector */}
          <div className="flex items-center gap-1.5">
            {(
              Object.keys(PRIORITY_CONFIG) as Array<
                keyof typeof PRIORITY_CONFIG
              >
            ).map((p) => {
              const cfg = PRIORITY_CONFIG[p];
              const isActive = priority === p;
              return (
                <button
                  key={p}
                  onClick={() => cyclePriority(p)}
                  title={cfg.label}
                  className={`w-5 h-5 rounded-full ${cfg.color} transition-all duration-200 cursor-pointer
                    ${isActive ? `ring-2 ${cfg.ring} scale-125` : "opacity-40 hover:opacity-70"}`}
                />
              );
            })}
            {priority && (
              <span className="text-[11px] text-[#8c8c8c] font-medium ml-1">
                {PRIORITY_CONFIG[priority].label}
              </span>
            )}
          </div>

          <span className="text-[12px] text-[#b0a99e] font-medium tabular-nums">
            {content.length} chars
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-[#c5bfb5] hidden sm:inline">
            Ctrl + Enter
          </span>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="px-5 py-2 rounded-xl bg-[#0f0f0f] text-[#d4f24a] text-[13px] font-bold font-syne tracking-tight
                       hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all duration-200 active:scale-95 shadow-sm cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-[#d4f24a] border-t-transparent rounded-full animate-spin" />
            ) : (
              "Save Idea"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
