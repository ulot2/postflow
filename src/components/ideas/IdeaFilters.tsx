"use client";

import { Search, ArrowUpDown } from "lucide-react";

type Priority = "hot" | "maybe" | "someday";
type SortOrder = "newest" | "oldest";

const PRIORITY_CONFIG = {
  hot: { color: "bg-red-500", label: "Hot" },
  maybe: { color: "bg-amber-400", label: "Maybe" },
  someday: { color: "bg-emerald-400", label: "Someday" },
} as const;

interface IdeaFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allTags: string[];
  activeTag: string | null;
  onTagFilter: (tag: string | null) => void;
  activePriority: Priority | null;
  onPriorityFilter: (priority: Priority | null) => void;
  sortOrder: SortOrder;
  onSortChange: (order: SortOrder) => void;
}

export function IdeaFilters({
  searchQuery,
  onSearchChange,
  allTags,
  activeTag,
  onTagFilter,
  activePriority,
  onPriorityFilter,
  sortOrder,
  onSortChange,
}: IdeaFiltersProps) {
  return (
    <div className="flex flex-col gap-3 bg-white rounded-2xl border border-[#e0dbd3] p-4 shadow-sm">
      {/* Top row: Search + Sort */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#b0a99e]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search ideas..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#faf8f4] border border-[#e0dbd3] text-[14px] text-[#0f0f0f] placeholder:text-[#b0a99e] focus:outline-none focus:ring-2 focus:ring-[#d4f24a]/50 focus:border-[#d4f24a] transition-all font-medium"
          />
        </div>
        <button
          onClick={() =>
            onSortChange(sortOrder === "newest" ? "oldest" : "newest")
          }
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#faf8f4] border border-[#e0dbd3] text-[13px] font-semibold text-[#5a5347] hover:bg-[#f0ebe1] transition-colors cursor-pointer shrink-0"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          {sortOrder === "newest" ? "Newest" : "Oldest"}
        </button>
      </div>

      {/* Bottom row: Priority pills + Tag pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Priority filters */}
        <button
          onClick={() => onPriorityFilter(null)}
          className={`px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
            activePriority === null
              ? "bg-[#0f0f0f] text-white"
              : "bg-[#faf8f4] text-[#6b6b6b] border border-[#e0dbd3] hover:bg-[#f0ebe1]"
          }`}
        >
          All
        </button>
        {(Object.keys(PRIORITY_CONFIG) as Priority[]).map((p) => {
          const cfg = PRIORITY_CONFIG[p];
          const isActive = activePriority === p;
          return (
            <button
              key={p}
              onClick={() => onPriorityFilter(isActive ? null : p)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#0f0f0f] text-white"
                  : "bg-[#faf8f4] text-[#6b6b6b] border border-[#e0dbd3] hover:bg-[#f0ebe1]"
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${cfg.color}`} />
              {cfg.label}
            </button>
          );
        })}

        {/* Divider */}
        {allTags.length > 0 && <div className="w-px h-5 bg-[#e0dbd3] mx-1" />}

        {/* Tag filters */}
        {allTags.map((tag) => {
          const isActive = activeTag === tag;
          return (
            <button
              key={tag}
              onClick={() => onTagFilter(isActive ? null : tag)}
              className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-[#d4f24a] text-[#0f0f0f]"
                  : "bg-[#faf8f4] text-[#6b6b6b] border border-[#e0dbd3] hover:bg-[#f0ebe1]"
              }`}
            >
              #{tag}
            </button>
          );
        })}
      </div>
    </div>
  );
}
