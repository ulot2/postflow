"use client";

import { useWorkspace } from "@/components/providers/WorkspaceContext";
import { ChevronDown, Plus, Check } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { Id } from "../../../convex/_generated/dataModel";
import { AddWorkspaceModal } from "./AddWorkspaceModal";

export function WorkspaceSwitcher() {
  const { workspaces, activeWorkspace, setActiveWorkspace } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  if (!activeWorkspace) return null;

  const initials = activeWorkspace.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.08] transition-colors cursor-pointer"
        >
          {/* Logo / Initials */}
          {activeWorkspace.brandLogoUrl ? (
            <Image
              src={activeWorkspace.brandLogoUrl}
              alt={activeWorkspace.name}
              width={32}
              height={32}
              className="w-8 h-8 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#d4f24a] flex items-center justify-center text-[#0f0f0f] text-xs font-bold font-syne shrink-0">
              {initials}
            </div>
          )}
          <div className="flex-1 text-left min-w-0">
            <div className="text-sm font-semibold text-white truncate">
              {activeWorkspace.name}
            </div>
            <div className="text-[11px] text-white/40 capitalize">
              {activeWorkspace.type}
            </div>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-white/40 transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown */}
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl shadow-xl overflow-hidden">
              <div className="p-1.5">
                {workspaces.map((ws) => {
                  const wsInitials = ws.name
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase();
                  const isActive = ws._id === activeWorkspace._id;

                  return (
                    <button
                      key={ws._id}
                      onClick={() => {
                        setActiveWorkspace(ws._id as Id<"workspaces">);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                        isActive ? "bg-white/[0.08]" : "hover:bg-white/[0.05]"
                      }`}
                    >
                      {ws.brandLogoUrl ? (
                        <Image
                          src={ws.brandLogoUrl}
                          alt={ws.name}
                          width={28}
                          height={28}
                          className="w-7 h-7 rounded-md object-cover shrink-0"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-md bg-[#d4f24a]/20 flex items-center justify-center text-[#d4f24a] text-[10px] font-bold font-syne shrink-0">
                          {wsInitials}
                        </div>
                      )}
                      <span className="text-sm text-white/80 truncate flex-1 text-left">
                        {ws.name}
                      </span>
                      {isActive && (
                        <Check className="w-4 h-4 text-[#d4f24a] shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-[#2a2a2a] p-1.5">
                <button
                  onClick={() => {
                    setOpen(false);
                    setModalOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-md border border-dashed border-white/20 flex items-center justify-center">
                    <Plus className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm">Add Workspace</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <AddWorkspaceModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
