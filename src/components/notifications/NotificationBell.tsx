"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { NotificationPopover } from "./NotificationPopover";

export function NotificationBell() {
  const unreadCount = useQuery(api.notifications.getUnreadCount);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
        aria-label="Notifications"
      >
        <Bell className="w-[18px] h-[18px] text-white/50 group-hover:text-white/80 transition-colors" />
        {(unreadCount ?? 0) > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[9px] font-bold text-white animate-in zoom-in-50 duration-200">
            {unreadCount! > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && <NotificationPopover onClose={() => setOpen(false)} />}
    </div>
  );
}
