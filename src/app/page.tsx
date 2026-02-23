"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/calendar/Calendar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f7f4ef]">
        <header className="flex justify-between items-center mb-8 bg-white border border-[#e0dbd3] p-4 rounded-xl">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0f0f0f] font-syne">
              Content Calendar
            </h2>
            <p className="text-sm text-[#6b6b6b]">
              Plan and schedule your upcoming social posts
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/create" passHref>
              <Button className="bg-[#0f0f0f] text-[#d4f24a] hover:opacity-90 font-syne font-bold shadow-md rounded-xl px-5">
                + New Post
              </Button>
            </Link>
          </div>
        </header>

        <div className="h-[calc(100vh-140px)]">
          <Calendar />
        </div>
      </main>
    </div>
  );
}
