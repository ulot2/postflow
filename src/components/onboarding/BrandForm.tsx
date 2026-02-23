"use client";

import { useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useRouter } from "next/navigation";
import { useUser, useSession } from "@clerk/nextjs";
import { completeClerkOnboarding } from "@/app/actions/onboarding";
import Image from "next/image";

export default function BrandForm() {
  const { user } = useUser();
  const { session } = useSession();
  const router = useRouter();
  const completeOnboarding = useMutation(api.users.completeOnboarding);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  const [workspaceType, setWorkspaceType] = useState<
    "personal" | "company" | null
  >(null);
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

  const handlePersonalSelected = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await completeClerkOnboarding();
      await completeOnboarding({
        type: "personal",
      });

      // Update Clerk's memory so middleware is instantly aware
      if (user) {
        await user.reload(); // Might take a second if webhook isn't sync
      }

      // Force a new session token to sync the updated metadata to cookies
      if (session) {
        await session.getToken({ skipCache: true });
      }

      // We will perform a hard navigation to reload user data in clerk session
      router.refresh();
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create personal workspace",
      );
      setIsLoading(false);
    }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      let brandLogoId = undefined;

      if (logoFile) {
        // Generate upload URL
        const uploadUrlResult = await generateUploadUrl();
        const uploadUrl = uploadUrlResult; // depending on what it returns

        // Upload the file
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": logoFile.type },
          body: logoFile,
        });

        if (!result.ok) throw new Error("Failed to upload logo");
        const { storageId } = await result.json();
        brandLogoId = storageId;
      }

      await completeClerkOnboarding();
      await completeOnboarding({
        type: "company",
        name,
        description,
        brandLogoId,
      });

      if (user) {
        await user.reload();
      }

      // Force a new session token to sync the updated metadata to cookies
      if (session) {
        await session.getToken({ skipCache: true });
      }

      router.refresh();
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create company workspace",
      );
      setIsLoading(false);
    }
  };

  if (workspaceType === null) {
    return (
      <div className="flex flex-col gap-4">
        <button
          onClick={handlePersonalSelected}
          disabled={isLoading}
          className={`w-full text-left p-[20px] rounded-[14px] border-[1.5px] border-[#e0dbd3] bg-white transition hover:border-black group ${
            isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <div className="flex items-center justify-between pointer-events-none">
            <div>
              <h3 className="font-syne font-bold text-[17px] text-[#0f0f0f] mb-1">
                Personal Brand
              </h3>
              <p className="text-[13.5px] text-[#6b6b6b] font-instrument-sans">
                Just for me. Start posting right away.
              </p>
            </div>
            <div className="w-[32px] h-[32px] rounded-full bg-[#f7f4ef] flex items-center justify-center text-[#0f0f0f] group-hover:bg-[#0f0f0f] group-hover:text-white transition">
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
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>
        </button>

        <button
          onClick={() => setWorkspaceType("company")}
          disabled={isLoading}
          className={`w-full p-[20px] rounded-[14px] border-[1.5px] border-[#e0dbd3] bg-white transition hover:border-[#db2777] group text-left ${
            isLoading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <div className="flex items-center justify-between pointer-events-none">
            <div>
              <h3 className="font-syne font-bold text-[17px] text-[#0f0f0f] mb-1 group-hover:text-[#db2777]">
                Company/Client Brand
              </h3>
              <p className="text-[13.5px] text-[#6b6b6b] font-instrument-sans">
                Setup a workspace for a team or client.
              </p>
            </div>
            <div className="w-[32px] h-[32px] rounded-full bg-[#f7f4ef] flex items-center justify-center text-[#0f0f0f] group-hover:bg-[#db2777] group-hover:text-white transition">
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
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </div>
          </div>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleCompanySubmit} className="flex flex-col gap-5">
      {error && (
        <div className="bg-red-50 text-red-600 text-[13.5px] p-2.5 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Back Button */}
      <button
        type="button"
        onClick={() => setWorkspaceType(null)}
        disabled={isLoading}
        className="self-start flex items-center gap-1.5 text-[13px] font-bold text-[#6b6b6b] hover:text-[#0f0f0f] transition font-syne uppercase tracking-wider mb-2"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back
      </button>

      {/* Logo Upload */}
      <div>
        <label className="block text-[10.5px] font-bold tracking-[0.11em] uppercase text-[#6b6b6b] mb-2 font-syne">
          Brand Logo
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-[64px] h-[64px] rounded-full border-2 border-dashed border-[#e0dbd3] hover:border-black transition flex items-center justify-center bg-white overflow-hidden"
          >
            {logoPreview ? (
              <Image
                src={logoPreview}
                alt="Logo preview"
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            ) : (
              <svg
                width="24"
                height="24"
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
            <p className="font-semibold text-black mb-0.5">
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
          className="w-full bg-white border-[1.5px] border-[#e0dbd3] text-[#0f0f0f] px-[15px] py-[12px] rounded-[11px] text-[14.5px] font-instrument-sans outline-none focus:border-black transition-colors"
        />
      </div>

      <div>
        <label className="block text-[10.5px] font-bold tracking-[0.11em] uppercase text-[#6b6b6b] mb-1.5 font-syne">
          Brief Description (Optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What does this brand do?"
          rows={3}
          className="w-full bg-white border-[1.5px] border-[#e0dbd3] text-[#0f0f0f] px-[15px] py-[12px] rounded-[11px] text-[14.5px] font-instrument-sans outline-none focus:border-black transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={!name || isLoading}
        className={`w-full flex items-center justify-center gap-2.5 mt-2 bg-[#0f0f0f] text-[#d4f24a] rounded-[11px] px-5 py-3.5 font-syne font-bold text-[15px] transition ${
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
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
