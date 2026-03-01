"use client";

import { useState } from "react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  startOfDay,
} from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

interface CustomDatePickerProps {
  value: string; // YYYY-MM-DD format
  onChange: (value: string) => void;
}

export function CustomDatePicker({ value, onChange }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Default to today if no value is provided, but we don't select it unless clicked
  const initialDate = value ? new Date(value + "T00:00:00") : new Date();
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(initialDate));

  const selectedDate = value ? new Date(value + "T00:00:00") : null;

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const dateFormat = "MMMM yyyy";
  const days = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start text-left font-normal bg-slate-50 border-slate-300 hover:bg-slate-100 ${
            !value ? "text-slate-500" : "text-slate-900"
          }`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(new Date(value + "T00:00:00"), "PPP") : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0 rounded-2xl shadow-xl border-slate-200"
        align="start"
      >
        <div className="p-4 bg-white rounded-2xl">
          <div className="flex justify-between items-center mb-4">
            <button
              aria-label="Previous month"
              onClick={prevMonth}
              className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="font-semibold text-slate-800">
              {format(currentMonth, dateFormat)}
            </div>
            <button
              aria-label="Next month"
              onClick={nextMonth}
              className="p-1.5 rounded-full hover:bg-slate-100 transition-colors text-slate-600"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-medium text-slate-400 py-1"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 text-sm">
            {days.map((day, i) => {
              const isSelected = selectedDate
                ? isSameDay(day, selectedDate)
                : false;
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isTodayDate = isToday(day);

              return (
                <button
                  key={i}
                  onClick={() => {
                    onChange(format(day, "yyyy-MM-dd"));
                    setIsOpen(false);
                  }}
                  disabled={day < startOfDay(new Date()) && !isTodayDate} // Prevent past dates, but allow today
                  className={`
                    h-9 w-9 rounded-full flex items-center justify-center transition-all
                    ${!isCurrentMonth ? "text-slate-300 pointer-events-none" : "text-slate-700"}
                    ${isSelected ? "bg-slate-900 text-white shadow-md scale-105" : "hover:bg-slate-100"}
                    ${isTodayDate && !isSelected ? "border border-slate-300 text-slate-900 font-bold" : ""}
                    ${day < startOfDay(new Date()) && !isTodayDate ? "opacity-30 cursor-not-allowed pointer-events-none" : ""}
                  `}
                >
                  {format(day, "d")}
                </button>
              );
            })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
