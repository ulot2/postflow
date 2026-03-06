"use client";

import { useState, useRef, useEffect } from "react";
import { Trash2, ArrowUpRight, Pin, Check, X } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { Id } from "../../../convex/_generated/dataModel";
import { ConfirmDeletePopover } from "../shared/ConfirmDeletePopover";

type Priority = "hot" | "maybe" | "someday" | undefined;

const PRIORITY_CONFIG = {
  hot: { color: "bg-red-500", label: "Hot" },
  maybe: { color: "bg-amber-400", label: "Maybe" },
  someday: { color: "bg-emerald-400", label: "Someday" },
} as const;

const PRIORITY_CYCLE: Priority[] = ["hot", "maybe", "someday", undefined];

interface IdeaCardProps {
  id: Id<"ideas">;
  content: string;
  createdAt: number;
  tags?: string[];
  pinned?: boolean;
  priority?: Priority;
  onDelete: (id: Id<"ideas">) => void;
  onUpdate: (id: Id<"ideas">, content: string) => void;
  onTogglePin: (id: Id<"ideas">) => void;
  onUpdatePriority: (id: Id<"ideas">, priority: Priority) => void;
}

export function IdeaCard({
  id,
  content,
  createdAt,
  tags,
  pinned,
  priority,
  onDelete,
  onUpdate,
  onTogglePin,
  onUpdatePriority,
}: IdeaCardProps) {
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true });
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = textareaRef.current.value.length;
      // Auto-resize
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    const trimmed = editContent.trim();
    if (trimmed && trimmed !== content) {
      onUpdate(id, trimmed);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditContent(content);
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      handleCancelEdit();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSaveEdit();
    }
  };

  const cyclePriority = () => {
    const currentIdx = PRIORITY_CYCLE.indexOf(priority);
    const nextIdx = (currentIdx + 1) % PRIORITY_CYCLE.length;
    onUpdatePriority(id, PRIORITY_CYCLE[nextIdx]);
  };

  return (
    <div
      className={`group relative bg-white rounded-2xl border p-5 shadow-sm hover:shadow-lg hover:shadow-black/4 hover:-translate-y-0.5 transition-all duration-300 ${
        pinned ? "border-[#d4f24a]/50 bg-[#fefff8]" : "border-[#e0dbd3]"
      }`}
    >
      {/* Top right actions */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5">
        <div className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
          <ConfirmDeletePopover onConfirm={() => onDelete(id)}>
            <button
              className="p-1.5 rounded-lg text-[#a09a90] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer bg-white/50 backdrop-blur-sm"
              title="Delete Idea"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </ConfirmDeletePopover>
        </div>

        {/* Pin indicator */}
        {pinned && (
          <div className="w-5 h-5 rounded-full bg-[#d4f24a] shrink-0 flex items-center justify-center">
            <Pin className="w-3 h-3 text-[#0f0f0f] fill-current" />
          </div>
        )}
      </div>

      {/* Priority dot + Content */}
      <div className="flex gap-3 mb-3">
        {/* Priority indicator — clickable to cycle */}
        <button
          onClick={cyclePriority}
          title={priority ? PRIORITY_CONFIG[priority].label : "Set priority"}
          className="mt-1 shrink-0 cursor-pointer"
        >
          <div
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              priority
                ? PRIORITY_CONFIG[priority].color
                : "bg-[#e0dbd3] hover:bg-[#c5bfb5]"
            }`}
          />
        </button>

        {/* Content — double click to edit */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <textarea
                ref={textareaRef}
                value={editContent}
                onChange={(e) => {
                  setEditContent(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onKeyDown={handleEditKeyDown}
                className="w-full resize-none bg-[#faf8f4] rounded-xl border border-[#d4f24a] px-3 py-2 text-[14px] text-[#0f0f0f] leading-relaxed font-medium focus:outline-none focus:ring-2 focus:ring-[#d4f24a]/30"
              />
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#0f0f0f] text-[#d4f24a] text-[11px] font-bold hover:opacity-90 transition-all cursor-pointer"
                >
                  <Check className="w-3 h-3" /> Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="flex items-center gap-1 px-3 py-1 rounded-lg bg-[#faf8f4] text-[#6b6b6b] text-[11px] font-bold border border-[#e0dbd3] hover:bg-[#f0ebe1] transition-all cursor-pointer"
                >
                  <X className="w-3 h-3" /> Cancel
                </button>
                <span className="text-[10px] text-[#b0a99e] ml-auto">
                  Ctrl+Enter to save
                </span>
              </div>
            </div>
          ) : (
            <p
              onDoubleClick={() => {
                setEditContent(content);
                setIsEditing(true);
              }}
              className="text-[15px] text-[#2b2b2b] font-medium leading-relaxed whitespace-pre-wrap wrap-break-word cursor-text select-none"
              title="Double-click to edit"
            >
              {content}
            </p>
          )}
        </div>
      </div>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3 ml-6">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-[#f7f4ef] text-[11px] font-semibold text-[#6b6b6b] border border-[#e0dbd3]/60"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex flex-nowrap items-center justify-between gap-2 pt-3 border-t border-[#f0ebe1]">
        <span className="text-[12px] text-[#a09a90] font-medium whitespace-nowrap">
          {timeAgo}
        </span>

        <div className="flex items-center gap-1 shrink-0 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
          {/* Pin toggle */}
          <button
            onClick={() => onTogglePin(id)}
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              pinned
                ? "text-[#7a8a2a] bg-[#f0fdce]"
                : "text-[#6b6b6b] hover:text-[#0f0f0f] hover:bg-[#f0ebe1]"
            }`}
            title={pinned ? "Unpin" : "Pin to top"}
          >
            <Pin className={`w-4 h-4 ${pinned ? "fill-current" : ""}`} />
          </button>

          <Link
            href={`/create?content=${encodeURIComponent(content)}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold text-[#0f0f0f] bg-[#f0fdce] border border-[#d4f24a]/30 hover:bg-[#d4f24a] transition-colors duration-200"
          >
            Create Post
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
