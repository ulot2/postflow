"use client";

import { useState, useEffect, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useWorkspace } from "@/components/providers/WorkspaceContext";
import { Camera, Check, Loader2 } from "lucide-react";
import Image from "next/image";
import { Id } from "../../../convex/_generated/dataModel";

export function WorkspaceSettings() {
  const { activeWorkspace, setActiveWorkspace, workspaces } = useWorkspace();
  const updateWorkspace = useMutation(api.workspaces.updateWorkspace);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [newLogoId, setNewLogoId] = useState<string | null>(null);
  const [removeLogo, setRemoveLogo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Init form when workspace loads
  useEffect(() => {
    if (activeWorkspace) {
      setName(activeWorkspace.name);
      setDescription(activeWorkspace.description ?? "");
      setLogoPreview(activeWorkspace.brandLogoUrl ?? null);
      setNewLogoId(null);
      setRemoveLogo(false);
    }
  }, [activeWorkspace?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const url = await generateUploadUrl();
      const res = await fetch(url, { method: "POST", body: file });
      const { storageId } = await res.json();
      setNewLogoId(storageId);
      setRemoveLogo(false);
      setLogoPreview(URL.createObjectURL(file));
    } catch (err) {
      console.error("Upload failed:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview(null);
    setNewLogoId(null);
    setRemoveLogo(true);
  };

  const handleSave = async () => {
    if (!activeWorkspace || !name.trim()) return;
    setSaving(true);
    try {
      await updateWorkspace({
        id: activeWorkspace._id,
        name: name.trim(),
        description: description.trim() || undefined,
        ...(newLogoId ? { brandLogoId: newLogoId as Id<"_storage"> } : {}),
        removeLogo,
      });
      // Update local context with new values
      const updated = workspaces.find((w) => w._id === activeWorkspace._id);
      if (updated) {
        setActiveWorkspace(activeWorkspace._id);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  if (!activeWorkspace) {
    return (
      <div className="text-[#6b6b6b] text-center py-12">
        No workspace selected.
      </div>
    );
  }

  const hasChanges =
    name !== activeWorkspace.name ||
    description !== (activeWorkspace.description ?? "") ||
    newLogoId !== null ||
    removeLogo;

  return (
    <div className="space-y-8">
      {/* Logo */}
      <div>
        <label className="block text-[13px] font-semibold text-[#0f0f0f] mb-3 font-syne uppercase tracking-wider">
          Brand Logo
        </label>
        <div className="flex items-start gap-6 p-6 rounded-2xl border border-[#e0dbd3] bg-[#faf9f7]/50 transition-all duration-300 hover:bg-[#faf9f7]">
          {/* Avatar Area */}
          <div
            className="relative group cursor-pointer shrink-0"
            onClick={() => fileRef.current?.click()}
          >
            <div className="w-[88px] h-[88px] rounded-2xl overflow-hidden border border-[#e0dbd3] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 group-hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] group-hover:border-[#0f0f0f]">
              {logoPreview ? (
                <Image
                  src={logoPreview}
                  alt="Logo"
                  width={88}
                  height={88}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 text-[#a3a3a3] group-hover:text-[#0f0f0f] transition-colors duration-300">
                  <Camera className="w-6 h-6" />
                  <span className="text-[10px] font-bold tracking-wider">
                    UPLOAD
                  </span>
                </div>
              )}

              {/* Hover Overlay for existing logo */}
              {logoPreview && (
                <div className="absolute inset-0 bg-[#0f0f0f]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              )}
            </div>

            {/* Uploading Spinner Overlay */}
            {uploading && (
              <div className="absolute inset-0 bg-white/90 rounded-2xl flex items-center justify-center shadow-sm backdrop-blur-md z-10">
                <Loader2 className="w-6 h-6 animate-spin text-[#0f0f0f]" />
              </div>
            )}

            {/* Floating Camera Badge */}
            {logoPreview && !uploading && (
              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#0f0f0f] text-[#d4f24a] flex items-center justify-center shadow-md transform transition-transform duration-300 group-hover:scale-110 border-2 border-white">
                <Camera className="w-3.5 h-3.5" />
              </div>
            )}
          </div>

          {/* Action Buttons & Text */}
          <div className="flex flex-col gap-3 pt-1">
            <span className="text-[13px] text-[#6b6b6b] leading-relaxed max-w-[240px]">
              Personalize your workspace with a brand logo. <br />
              <span className="text-[#a3a3a3]">
                Recommended: 512x512px (PNG, JPG)
              </span>
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="text-[13px] font-semibold px-4 py-2 rounded-xl bg-white border border-[#e0dbd3] hover:border-[#0f0f0f] text-[#0f0f0f] transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95"
              >
                {logoPreview ? "Change Logo" : "Choose File"}
              </button>

              {logoPreview && (
                <button
                  type="button"
                  onClick={handleRemoveLogo}
                  className="text-[13px] font-medium px-4 py-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition-all cursor-pointer active:scale-95"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleLogoChange}
            className="hidden"
          />
        </div>
      </div>

      {/* Form Fields Container */}
      <div className="space-y-6 bg-white p-6 rounded-2xl border border-[#e0dbd3] shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
        {/* Name */}
        <div>
          <label
            htmlFor="ws-name"
            className="block text-[13px] font-semibold text-[#0f0f0f] mb-2 font-syne uppercase tracking-wider"
          >
            Brand Name
          </label>
          <div className="relative">
            <input
              id="ws-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#e0dbd3] bg-[#faf9f7] text-[#0f0f0f] text-[15px] font-medium focus:outline-none focus:border-[#0f0f0f] focus:ring-4 focus:ring-[#0f0f0f]/5 focus:bg-white transition-all placeholder:text-[#a3a3a3]"
              placeholder="E.g., Acme Corp"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="ws-desc"
            className="block text-[13px] font-semibold text-[#0f0f0f] mb-2 font-syne uppercase tracking-wider"
          >
            Description
          </label>
          <div className="relative">
            <textarea
              id="ws-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[#e0dbd3] bg-[#faf9f7] text-[#0f0f0f] text-[15px] focus:outline-none focus:border-[#0f0f0f] focus:ring-4 focus:ring-[#0f0f0f]/5 focus:bg-white transition-all resize-none placeholder:text-[#a3a3a3]"
              placeholder="Tell us a bit about what your brand does"
            />
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between pt-2">
        {/* Workspace Type Badge */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[11px] font-semibold text-[#6b6b6b] mb-0 font-syne uppercase tracking-wider">
            Plan Type
          </label>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-[#e0dbd3] bg-[#faf9f7]">
            <div className="w-2 h-2 rounded-full bg-[#d4f24a] shadow-[0_0_8px_rgba(212,242,74,0.6)] animate-pulse" />
            <span className="text-[13px] font-bold text-[#0f0f0f] capitalize tracking-wide">
              {activeWorkspace.type}
            </span>
          </div>
        </div>

        {/* Save */}
        <div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || !hasChanges || !name.trim()}
            className={`relative overflow-hidden inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-[14px] font-bold transition-all duration-300 cursor-pointer ${
              saved
                ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                : hasChanges && name.trim()
                  ? "bg-[#0f0f0f] text-[#d4f24a] hover:bg-[#1a1a1a] shadow-lg shadow-[#0f0f0f]/10 active:scale-95 group"
                  : "bg-[#faf9f7] text-[#a3a3a3] border border-[#e0dbd3] cursor-not-allowed"
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving…</span>
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved</span>
              </>
            ) : (
              <>
                <span>Save Changes</span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-0" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
