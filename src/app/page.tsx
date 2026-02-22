"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/calendar/Calendar";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50/50">
        <header className="flex justify-between items-center mb-8 glass-card p-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Content Calendar
            </h2>
            <p className="text-sm text-slate-500">
              Plan and schedule your upcoming social posts
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/create" passHref>
              <Button className="shadow-md">+ New Post</Button>
            </Link>
            <UserButton afterSignOutUrl="/sign-in" />
          </div>
        </header>

        <div className="h-[calc(100vh-140px)]">
          <Calendar />
        </div>
      </main>
    </div>
  );
}
