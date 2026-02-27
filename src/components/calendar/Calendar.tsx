"use client";

import {
  DndContext,
  DragEndEvent,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useMutation } from "convex/react";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addDays,
  addMonths,
  endOfDay,
  endOfMonth,
  format,
  isToday,
  isSameMonth,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PostCard } from "./PostCard";
import { PostPreviewModal } from "../shared/PostPreviewModal";
import { useWorkspace } from "@/components/providers/WorkspaceContext";

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

function DroppableDayZone({
  dateKey,
  children,
}: {
  dateKey: number;
  children: React.ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: dateKey.toString(),
    data: { date: dateKey },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 min-h-0 overflow-y-auto transition-colors ${
        isOver ? "bg-blue-50/60" : ""
      }`}
    >
      {children}
    </div>
  );
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { activeWorkspace } = useWorkspace();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const updateSchedule = useMutation(api.posts.updateSchedule);
  const deletePost = useMutation(api.posts.deletePost);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const postId = active.id as string;
    const newDateMs = over.data.current?.date as number;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await updateSchedule({ id: postId as any, scheduledDate: newDateMs });
  };

  /* ── Month-level date math ── */
  const monthStart = useMemo(() => startOfMonth(currentDate), [currentDate]);
  const monthEnd = useMemo(() => endOfMonth(currentDate), [currentDate]);

  // The visible grid always starts on Sunday and ends on Saturday.
  const gridStart = useMemo(
    () => startOfWeek(monthStart, { weekStartsOn: 0 }),
    [monthStart],
  );

  // Build an array of all visible days (up to 6 weeks × 7 = 42 cells).
  const calendarDays = useMemo(() => {
    const days: Date[] = [];
    let cursor = gridStart;
    // Always fill complete weeks until we've passed the end of the month.
    while (days.length < 42) {
      days.push(cursor);
      cursor = addDays(cursor, 1);
      // Stop at the end of a full week if we've already covered the month.
      if (days.length % 7 === 0 && cursor > monthEnd) break;
    }
    return days;
  }, [gridStart, monthEnd]);

  const gridEnd = calendarDays[calendarDays.length - 1];
  const weekCount = calendarDays.length / 7;

  /* ── Query posts for the visible date range ── */
  const startTs = useMemo(() => startOfDay(gridStart).getTime(), [gridStart]);
  const endTs = useMemo(() => endOfDay(gridEnd).getTime(), [gridEnd]);

  const postsInRange = useQuery(
    api.posts.getPostsInRange,
    activeWorkspace
      ? { workspaceId: activeWorkspace._id, startTs, endTs }
      : "skip",
  );

  const postsByDayKey = useMemo(() => {
    const map = new Map<number, NonNullable<typeof postsInRange>>();
    if (!postsInRange) return map;
    for (const post of postsInRange) {
      const dayTs =
        post.scheduledDate != null
          ? startOfDay(new Date(post.scheduledDate)).getTime()
          : 0;
      if (!map.has(dayTs)) map.set(dayTs, []);
      map.get(dayTs)!.push(post);
    }
    return map;
  }, [postsInRange]);

  /* ── Navigation handlers ── */
  const handlePrevMonth = () => setCurrentDate((prev) => addMonths(prev, -1));

  const handleNextMonth = () => setCurrentDate((prev) => addMonths(prev, 1));

  const handleToday = () => setCurrentDate(new Date());

  /* ── Render ── */
  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-1 pb-4">
          <h1 className="text-2xl font-bold tracking-tight text-[#0f0f0f] font-syne">
            {format(currentDate, "MMMM yyyy")}
          </h1>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg border-[#e0dbd3] text-[#6b6b6b] hover:bg-white cursor-pointer"
              onClick={handlePrevMonth}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-[#e0dbd3] px-4 text-sm font-medium text-[#0f0f0f] hover:bg-white cursor-pointer"
              onClick={handleToday}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-lg border-[#e0dbd3] text-[#6b6b6b] hover:bg-white cursor-pointer"
              onClick={handleNextMonth}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* ── Calendar grid ── */}
        <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-[#e0dbd3] bg-white">
          {/* Day-of-week header */}
          <div className="calendar-grid-7 border-b border-[#e0dbd3] bg-[#faf8f4]">
            {DAY_LABELS.map((label) => (
              <div
                key={label}
                className="border-r border-[#e0dbd3] px-3 py-2.5 text-center text-xs font-semibold text-[#6b6b6b] last:border-r-0"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Weeks */}
          <div
            className="grid flex-1 min-h-0"
            style={{ gridTemplateRows: `repeat(${weekCount}, 1fr)` }}
          >
            {Array.from({ length: weekCount }).map((_, weekIdx) => (
              <div
                key={weekIdx}
                className="calendar-grid-7 border-b border-[#e0dbd3] last:border-b-0"
              >
                {calendarDays.slice(weekIdx * 7, weekIdx * 7 + 7).map((day) => {
                  const dayKey = startOfDay(day).getTime();
                  const dayPosts = postsByDayKey.get(dayKey) ?? [];
                  const inMonth = isSameMonth(day, currentDate);
                  const today = isToday(day);

                  return (
                    <div
                      key={day.toISOString()}
                      className={[
                        "flex flex-col min-h-0 border-r border-[#e0dbd3] last:border-r-0",
                        !inMonth ? "bg-[#faf8f4]/60" : "bg-white",
                      ].join(" ")}
                    >
                      {/* Day number */}
                      <div className="px-2.5 pt-2 pb-1">
                        <span
                          className={[
                            "text-sm",
                            today
                              ? "font-bold text-[#d4f24a] bg-[#0f0f0f] w-6 h-6 rounded-full flex items-center justify-center"
                              : inMonth
                                ? "font-medium text-[#0f0f0f]"
                                : "font-medium text-[#c5c0b8]",
                          ].join(" ")}
                        >
                          {format(day, "d")}
                        </span>
                      </div>

                      {/* Droppable zone / posts */}
                      <DroppableDayZone dateKey={dayKey}>
                        <div className="flex flex-col gap-1 px-1.5 pb-1.5">
                          {dayPosts.map((post) => (
                            <PostCard
                              key={post._id}
                              id={post._id}
                              platform={post.platform}
                              contentPreview={post.content}
                              timeLabel={
                                post.scheduledDate != null
                                  ? format(
                                      new Date(post.scheduledDate),
                                      "HH:mm",
                                    )
                                  : undefined
                              }
                              status={post.status}
                              onClick={() => setSelectedPost(post)}
                              onEdit={(e) => {
                                e.stopPropagation();
                                router.push(`/edit/${post._id}`);
                              }}
                              onDelete={(e) => {
                                e.stopPropagation();
                                if (
                                  confirm(
                                    "Are you sure you want to delete this post?",
                                  )
                                ) {
                                  deletePost({ id: post._id });
                                }
                              }}
                            />
                          ))}
                        </div>
                      </DroppableDayZone>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* ── Tip bar ── */}
        {/* <div className="mt-3 rounded-xl bg-blue-50/70 px-4 py-3 text-sm text-slate-600">
          <span className="mr-1.5">💡</span>
          <span className="font-semibold text-amber-600">Tip:</span> Drag and
          drop posts to reschedule them to different dates!
        </div> */}
      </div>

      <PostPreviewModal
        post={selectedPost}
        isOpen={selectedPost !== null}
        onClose={() => setSelectedPost(null)}
      />
    </DndContext>
  );
}
