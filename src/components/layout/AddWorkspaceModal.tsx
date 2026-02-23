"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useWorkspace } from "@/components/providers/WorkspaceContext";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function AddWorkspaceModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const createWorkspace = useMutation(api.workspaces.createWorkspace);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);
  const { setActiveWorkspace } = useWorkspace();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const url = URL.createObjectURL(file);
      setLogoPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let brandLogoId = undefined;

      if (logoFile) {
        const uploadUrl = await generateUploadUrl();
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": logoFile.type },
          body: logoFile,
        });
        if (!result.ok) throw new Error("Failed to upload logo");
        const { storageId } = await result.json();
        brandLogoId = storageId;
      }

      const workspaceId = await createWorkspace({
        name,
        description: description || undefined,
        type: "company",
        brandLogoId,
      });

      setActiveWorkspace(workspaceId);
      resetAndClose();
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Failed to create workspace",
      );
      setIsLoading(false);
    }
  };

  const resetAndClose = () => {
    setName("");
    setDescription("");
    setLogoFile(null);
    setLogoPreview(null);
    setIsLoading(false);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && resetAndClose()}>
      <DialogContent className="sm:max-w-[440px] bg-[#f7f4ef] border-[#e0dbd3] p-0 gap-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-syne text-[22px] font-extrabold tracking-[-0.02em] text-[#0f0f0f]">
            Add Workspace
          </DialogTitle>
          <p className="text-[13.5px] text-[#6b6b6b] mt-1">
            Create a new brand workspace to manage content separately.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {error && (
            <div className="bg-red-50 text-red-600 text-[13.5px] p-2.5 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          {/* Logo Upload */}
          <div>
            <label className="block text-[10.5px] font-bold tracking-[0.11em] uppercase text-[#6b6b6b] mb-2 font-syne">
              Brand Logo
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-[56px] h-[56px] rounded-full border-2 border-dashed border-[#e0dbd3] hover:border-[#0f0f0f] transition flex items-center justify-center bg-white overflow-hidden cursor-pointer"
              >
                {logoPreview ? (
                  <Image
                    src={logoPreview}
                    alt="Logo preview"
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#6b6b6b"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                )}
              </button>
              <div className="text-[13px] text-[#6b6b6b]">
                <p className="font-semibold text-[#0f0f0f] mb-0.5">
                  Upload logo (Optional)
                </p>
                <p>JPG, PNG up to 2MB</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleLogoChange}
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-[10.5px] font-bold tracking-[0.11em] uppercase text-[#6b6b6b] mb-1.5 font-syne">
              Brand Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Acme Corp"
              className="w-full bg-white border-[1.5px] border-[#e0dbd3] text-[#0f0f0f] px-[15px] py-[12px] rounded-[11px] text-[14.5px] font-instrument-sans outline-none focus:border-[#0f0f0f] transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10.5px] font-bold tracking-[0.11em] uppercase text-[#6b6b6b] mb-1.5 font-syne">
              Brief Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What does this brand do?"
              rows={2}
              className="w-full bg-white border-[1.5px] border-[#e0dbd3] text-[#0f0f0f] px-[15px] py-[12px] rounded-[11px] text-[14.5px] font-instrument-sans outline-none focus:border-[#0f0f0f] transition-colors resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!name || isLoading}
            className={`w-full flex items-center justify-center gap-2.5 bg-[#0f0f0f] text-[#d4f24a] rounded-[11px] px-5 py-3.5 font-syne font-bold text-[15px] transition ${
              !name || isLoading
                ? "opacity-70 cursor-not-allowed"
                : "cursor-pointer hover:opacity-90"
            }`}
          >
            {isLoading ? (
              <div className="w-[18px] h-[18px] border-2 border-[rgba(212,242,74,0.3)] border-t-[#d4f24a] rounded-full animate-spin" />
            ) : (
              <>
                Create Workspace
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </>
            )}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
