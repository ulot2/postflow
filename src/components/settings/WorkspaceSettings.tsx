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
        <div className="flex items-center gap-5">
          <div className="relative group">
            {logoPreview ? (
              <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden border-2 border-[#e0dbd3] bg-white">
                <Image
                  src={logoPreview}
                  alt="Logo"
                  width={72}
                  height={72}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-[72px] h-[72px] rounded-2xl border-2 border-dashed border-[#e0dbd3] bg-white flex items-center justify-center">
                <Camera className="w-6 h-6 text-[#6b6b6b]" />
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin text-[#0f0f0f]" />
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => fileRef.current?.click()}
              className="text-[13px] font-semibold text-[#0f0f0f] hover:text-[#d4f24a] transition-colors cursor-pointer"
            >
              {logoPreview ? "Change logo" : "Upload logo"}
            </button>
            {logoPreview && (
              <button
                onClick={handleRemoveLogo}
                className="text-[13px] text-red-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                Remove
              </button>
            )}
            <span className="text-[11px] text-[#6b6b6b]">
              PNG, JPG up to 2MB
            </span>
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

      {/* Name */}
      <div>
        <label
          htmlFor="ws-name"
          className="block text-[13px] font-semibold text-[#0f0f0f] mb-2 font-syne uppercase tracking-wider"
        >
          Brand Name
        </label>
        <input
          id="ws-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-[#e0dbd3] bg-white text-[#0f0f0f] text-[14px] focus:outline-none focus:border-[#0f0f0f] transition-colors placeholder:text-[#6b6b6b]"
          placeholder="Your brand name"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="ws-desc"
          className="block text-[13px] font-semibold text-[#0f0f0f] mb-2 font-syne uppercase tracking-wider"
        >
          Description
        </label>
        <textarea
          id="ws-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[#e0dbd3] bg-white text-[#0f0f0f] text-[14px] focus:outline-none focus:border-[#0f0f0f] transition-colors resize-none placeholder:text-[#6b6b6b]"
          placeholder="Short description of your brand"
        />
      </div>

      {/* Workspace Type Badge */}
      <div className="flex justify-between">
        <div>
          <label className="block text-[13px] font-semibold text-[#0f0f0f] mb-2 font-syne uppercase tracking-wider">
            Type
          </label>
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-[13px] font-medium bg-[#0f0f0f] text-[#d4f24a] capitalize">
            {activeWorkspace.type}
          </span>
        </div>

        {/* Save */}
        <div className="pt-2">
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges || !name.trim()}
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl text-[14px] font-semibold transition-all cursor-pointer ${
              saved
                ? "bg-green-500 text-white"
                : hasChanges && name.trim()
                  ? "bg-[#0f0f0f] text-[#d4f24a] hover:opacity-90"
                  : "bg-[#e0dbd3] text-[#6b6b6b] cursor-not-allowed"
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving…
              </>
            ) : saved ? (
              <>
                <Check className="w-4 h-4" /> Saved
              </>
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
