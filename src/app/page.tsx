import { Sidebar } from "@/components/layout/Sidebar";

export default function Home() {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <header className="flex justify-between items-center mb-8 glass-card p-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Content Calendar
            </h2>
            <p className="text-sm text-white/50">
              Plan and schedule your upcoming social posts
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-primary-500/20">
              + New Post
            </button>
            <div className="w-10 h-10 rounded-full bg-surface-hover border border-white/10 overflow-hidden">
              {/* User Avatar Placeholder */}
            </div>
          </div>
        </header>

        {/* Main Content Area (Calendar Grid will go here) */}
        <div className="h-[calc(100vh-140px)] glass-card flex items-center justify-center border-dashed border-2 border-white/10 bg-transparent">
          <p className="text-white/40">Calendar Interface Area</p>
        </div>
      </main>
    </div>
  );
}
