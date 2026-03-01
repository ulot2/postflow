"use client";

import { useState, useRef, useEffect } from "react";
import { Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface CustomTimePickerProps {
  value: string; // HH:mm format (24 hour)
  onChange: (value: string) => void;
}

export function CustomTimePicker({ value, onChange }: CustomTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Refs for auto-scrolling to the selected item
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const ampmRef = useRef<HTMLDivElement>(null);

  // Parse initial value
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hour: 12, minute: 0, ampm: "AM" };
    const [h, m] = timeStr.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour12 = h % 12 || 12;
    return { hour: hour12, minute: m || 0, ampm };
  };

  const time = parseTime(value);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i); // 0 to 59
  const ampms = ["AM", "PM"];

  const handleTimeChange = (
    type: "hour" | "minute" | "ampm",
    val: number | string,
  ) => {
    const newTime = { ...time, [type]: val };

    // Construct 24h format string
    let h24 = newTime.hour;
    if (newTime.ampm === "PM" && h24 !== 12) h24 += 12;
    if (newTime.ampm === "AM" && h24 === 12) h24 = 0;

    const formattedHour = h24.toString().padStart(2, "0");
    const formattedMinute = newTime.minute.toString().padStart(2, "0");
    onChange(`${formattedHour}:${formattedMinute}`);
  };

  // Scroll logic to keep the selected item centered when opened
  useEffect(() => {
    if (isOpen) {
      // 40px is the height of each item, so index * 40 sets the scrollTop
      if (hoursRef.current) hoursRef.current.scrollTop = (time.hour - 1) * 40;
      if (minutesRef.current) minutesRef.current.scrollTop = time.minute * 40;
      if (ampmRef.current)
        ampmRef.current.scrollTop = time.ampm === "AM" ? 0 : 40;
    }
  }, [isOpen, time.hour, time.minute, time.ampm]); // Only run on open and when time changes

  const formatDisplayTime = (h: number, m: number, a: string) => {
    return `${h}:${m.toString().padStart(2, "0")} ${a}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal bg-slate-50 border-slate-300 hover:bg-slate-100 ${
            !value ? "text-slate-500" : "text-slate-900"
          }`}
        >
          <Clock className="mr-2 h-4 w-4" />
          {value
            ? formatDisplayTime(time.hour, time.minute, time.ampm)
            : "Pick a time"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-fit p-4 rounded-3xl shadow-2xl border-none bg-white font-sans"
        align="start"
      >
        <div className="relative flex items-center justify-center h-[200px] w-[280px] overflow-hidden bg-white select-none">
          {/* Central Highlight Overlay Component (Behind Text, over background) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[46px] bg-slate-100/80 rounded-2xl pointer-events-none z-0" />
          {/* Static Colon separator aligned with selected hour/minute */}
          <span className="absolute top-1/2 left-[41%] -translate-x-1/2 -translate-y-1/2 text-3xl font-medium text-slate-900 z-10 pointer-events-none pb-1">
            :
          </span>
          {/* HOURS WHEEL */}
          <div
            ref={hoursRef}
            className="h-full w-20 overflow-y-auto overflow-x-hidden scrollbar-hide snap-y snap-mandatory relative z-10 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Top Padding: half height minus half item height (100px - 20px) = 80px */}
            <div className="h-[80px] w-full shrink-0" />
            {hours.map((h) => {
              const isSelected = time.hour === h;
              return (
                <button
                  key={h}
                  onClick={(e) => {
                    handleTimeChange("hour", h);
                    e.currentTarget.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
                  className={`w-full h-[40px] flex items-center justify-end pr-5 text-center snap-center transition-all duration-200 ${
                    isSelected
                      ? "text-[28px] font-medium text-slate-900"
                      : "text-xl text-slate-300 hover:text-slate-400"
                  }`}
                >
                  {h}
                </button>
              );
            })}
            <div className="h-[80px] w-full shrink-0" />
          </div>
          <div className="w-4" /> {/* Spacer for colon area */}
          {/* MINUTES WHEEL */}
          <div
            ref={minutesRef}
            className="h-full w-20 overflow-y-auto overflow-x-hidden scrollbar-hide snap-y snap-mandatory relative z-10 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            <div className="h-[80px] w-full shrink-0" />
            {minutes.map((m) => {
              const isSelected = time.minute === m;
              return (
                <button
                  key={m}
                  onClick={(e) => {
                    handleTimeChange("minute", m);
                    e.currentTarget.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
                  className={`w-full h-[40px] flex items-center justify-start pl-3 text-center snap-center transition-all duration-200 ${
                    isSelected
                      ? "text-[28px] font-medium text-slate-900"
                      : "text-xl text-slate-300 hover:text-slate-400"
                  }`}
                >
                  {m.toString().padStart(2, "0")}
                </button>
              );
            })}
            <div className="h-[80px] w-full shrink-0" />
          </div>
          {/* AM/PM WHEEL */}
          <div
            ref={ampmRef}
            className="h-full w-20 overflow-y-auto overflow-x-hidden scrollbar-hide snap-y snap-mandatory relative z-10 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {/* Tweak padding for only 2 items to ensure they can center */}
            <div className="h-[80px] w-full shrink-0" />
            {ampms.map((a) => {
              const isSelected = time.ampm === a;
              return (
                <button
                  key={a}
                  onClick={(e) => {
                    handleTimeChange("ampm", a);
                    e.currentTarget.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                  }}
                  className={`w-full h-[40px] flex items-center justify-center text-center snap-center transition-all duration-200 lowercase ${
                    isSelected
                      ? "text-[28px] font-medium text-slate-900"
                      : "text-xl text-slate-400 hover:text-slate-500"
                  }`}
                >
                  {a}
                </button>
              );
            })}
            <div className="h-[80px] w-full shrink-0" />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
