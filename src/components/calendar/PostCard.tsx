"use client";

import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { FaXTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa6";

type Platform = "twitter" | "linkedin" | "instagram";
type Status = "draft" | "scheduled" | "published";

interface PostCardProps {
  id: string;
  platform: Platform;
  contentPreview: string;
  timeLabel?: string;
  status: Status;
  onClick?: () => void;
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
};

const statusStyles: Record<Status, string> = {
  draft: "bg-amber-50 text-amber-700 border-amber-100",
  scheduled: "bg-emerald-50 text-emerald-700 border-emerald-100",
  published: "bg-slate-50 text-slate-700 border-slate-200",
};

export function PostCard({
  id,
  platform,
  contentPreview,
  timeLabel,
  status,
  onClick,
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
        "group flex flex-col gap-2 rounded-lg border border-slate-200 bg-white/90 px-3 py-2 text-xs shadow-sm transition-all hover:-translate-y-px hover:border-slate-300 hover:shadow-md",
        transform ? "z-50 opacity-90 cursor-grabbing" : "cursor-grab",
      )}
    >
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
          <span
            className={cn(
              "inline-flex items-center rounded-full border px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-[0.16em]",
              statusStyles[status],
            )}
          >
            {status}
          </span>
        </div>
      </div>

      <p className="line-clamp-3 text-[0.78rem] leading-snug text-slate-700">
        {contentPreview}
      </p>
    </div>
  );
}
