"use client";

import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import {
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
} from "react-icons/fa6";
import { Trash2, Pencil, Check } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Platform = "twitter" | "linkedin" | "instagram" | "pinterest";
type Status = "draft" | "scheduled" | "publishing" | "published" | "failed";

interface PostCardProps {
  id: string;
  platform: Platform;
  contentPreview: string;
  timeLabel?: string;
  status: Status;
  onClick?: () => void;
  onDelete?: (e: React.MouseEvent) => void;
  onEdit?: (e: React.MouseEvent) => void;
  onPublish?: (e: React.MouseEvent) => void;
}

const platformStyles: Record<
  Platform,
  { styles: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  twitter: {
    styles: "bg-sky-50 text-sky-700 border-sky-100",
    Icon: FaXTwitter,
  },
  linkedin: {
    styles: "bg-blue-50 text-blue-700 border-blue-100",
    Icon: FaLinkedinIn,
  },
  instagram: {
    styles: "bg-pink-50 text-pink-700 border-pink-100",
    Icon: FaInstagram,
  },
  pinterest: {
    styles: "bg-red-50 text-red-700 border-red-100",
    Icon: FaPinterestP,
  },
};

const statusStyles: Record<Status, string> = {
  draft: "bg-amber-50 text-amber-700 border-amber-100",
  scheduled: "bg-emerald-50 text-emerald-700 border-emerald-100",
  publishing: "bg-indigo-50 text-indigo-700 border-indigo-100",
  published: "bg-slate-50 text-slate-700 border-slate-200",
  failed: "bg-red-50 text-red-700 border-red-200",
};

export function PostCard({
  id,
  platform,
  contentPreview,
  timeLabel,
  status,
  onClick,
  onDelete,
  onEdit,
  onPublish,
}: PostCardProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
    data: { id, platform, status },
  });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  const { styles, Icon } = platformStyles[platform];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "group relative flex flex-col gap-2 rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-xs shadow-sm transition-all hover:z-50 hover:-translate-y-px hover:border-slate-300 hover:shadow-md",
        transform ? "z-50 opacity-90 cursor-grabbing" : "cursor-grab",
      )}
    >
      {/* Absolute Hover Actions */}
      <div className="absolute left-2 top-2 z-10 hidden items-center gap-1 rounded-md border border-slate-200 bg-white/95 p-1 shadow-sm backdrop-blur-sm group-hover:flex">
        {status === "scheduled" && platform !== "linkedin" && (
          <button
            onClick={onPublish}
            className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-emerald-600"
            title="Mark as Published"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        )}
        <button
          onClick={onEdit}
          className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-600"
          title="Edit Post"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="rounded p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-red-600"
          title="Delete Post"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em]",
            styles,
          )}
        >
          <Icon className="h-3 w-3" />
          {platform}
        </span>

        <div className="flex items-center gap-2">
          {timeLabel && (
            <span className="text-[0.7rem] font-medium text-slate-500">
              {timeLabel}
            </span>
          )}
          {status === "scheduled" && platform !== "linkedin" ? (
            <TooltipProvider>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <span
                    className={cn(
                      "group/tooltip relative inline-flex items-center rounded-full border px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em] cursor-help",
                      statusStyles[status],
                    )}
                  >
                    {status}
                    <span className="ml-1 text-amber-500">⚠️</span>
                  </span>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  className="max-w-[180px] p-2 text-center text-[0.75rem] font-normal normal-case leading-snug tracking-normal shadow-lg"
                >
                  <span className="block font-semibold text-slate-900 mb-0.5">
                    Manual Action Required
                  </span>
                  Auto-publishing is not yet supported for this platform.
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <span
              className={cn(
                "group/tooltip relative inline-flex items-center rounded-full border px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em]",
                statusStyles[status],
              )}
            >
              {status}
            </span>
          )}
        </div>
      </div>

      <p className="line-clamp-3 text-[0.78rem] leading-snug text-slate-700">
        {contentPreview}
      </p>
    </div>
  );
}
