"use client";

import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export interface PostFormData {
  content: string;
  imageUrl?: string;
  imageId?: Id<"_storage">;
  platforms: string[];
  scheduledDate: string;
  scheduledTime: string;
}

interface PostFormProps {
  data: PostFormData;
  onChange: (data: PostFormData) => void;
  onSubmit: (status: "draft" | "scheduled") => void;
  isEditing?: boolean;
}

const AVAILABLE_PLATFORMS = [
  {
    id: "twitter",
    label: "Twitter / X",
    color: "bg-black text-white hover:bg-slate-800",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    color: "bg-[#0A66C2] text-white hover:bg-[#084e96]",
  },
  {
    id: "instagram",
    label: "Instagram",
    color:
      "bg-linear-to-tr from-yellow-400 via-red-500 to-purple-500 text-white hover:opacity-90",
  },
  {
    id: "pinterest",
    label: "Pinterest",
    color: "bg-[#E60023] text-white hover:bg-[#c5001e]",
  },
];

export function PostForm({
  data,
  onChange,
  onSubmit,
  isEditing,
}: PostFormProps) {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const [isUploading, setIsUploading] = useState(false);

  const togglePlatform = (id: string) => {
    if (isEditing) return; // Prevent changing platform
    const newPlatforms = data.platforms.includes(id)
      ? data.platforms.filter((p) => p !== id)
      : [...data.platforms, id];
    onChange({ ...data, platforms: newPlatforms });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // 1. Show immediate local preview
      const localUrl = URL.createObjectURL(file);
      onChange({ ...data, imageUrl: localUrl });

      // 2. Generate Convex upload URL
      const uploadUrl = await generateUploadUrl();

      // 3. POST file to Convex Storage
      const result = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!result.ok) throw new Error("Upload failed");

      const { storageId } = await result.json();

      // 4. Update form data with the permanent storage ID
      onChange({
        ...data,
        imageUrl: localUrl,
        imageId: storageId as Id<"_storage">,
      });
    } catch (error) {
      console.error("Failed to upload image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-6">
        {/* Platforms */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Target Platforms
          </label>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_PLATFORMS.map((platform) => {
              if (isEditing && !data.platforms.includes(platform.id))
                return null;

              return (
                <button
                  key={platform.id}
                  onClick={() => togglePlatform(platform.id)}
                  disabled={isEditing}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    data.platforms.includes(platform.id)
                      ? platform.color +
                        " shadow-md" +
                        (!isEditing ? " scale-105" : "")
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  } ${isEditing ? "opacity-80 cursor-default" : ""}`}
                >
                  {platform.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Post Content
          </label>
          <textarea
            value={data.content}
            onChange={(e) => onChange({ ...data, content: e.target.value })}
            className="w-full h-40 p-4 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none bg-slate-50 transition-colors"
            placeholder="What do you want to share?"
          />
          <div className="flex justify-between items-center mt-2 text-xs text-slate-500">
            <span>Supports emoji and hashtags</span>
            <span>{data.content.length} characters</span>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Add an Image (Optional)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Paste image URL here..."
              title="Image URL"
              value={data.imageUrl || ""}
              onChange={(e) =>
                onChange({
                  ...data,
                  imageUrl: e.target.value,
                  imageId: undefined,
                })
              }
              className="flex-1 p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 bg-slate-50 text-sm"
              disabled={isUploading}
            />
            <div className="relative flex items-center">
              <input
                type="file"
                accept="image/*"
                title="Upload image"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
              />
              <Button
                type="button"
                variant="outline"
                className="shadow-sm border-slate-300 relative z-0 min-w-[100px]"
                disabled={isUploading}
              >
                {isUploading ? (
                  <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin mr-2" />
                ) : (
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                )}
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </div>
        </div>

        {/* Scheduling */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Date
            </label>
            <input
              type="date"
              title="Scheduled Date"
              value={data.scheduledDate}
              onChange={(e) =>
                onChange({ ...data, scheduledDate: e.target.value })
              }
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 bg-slate-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Time
            </label>
            <input
              type="time"
              title="Scheduled Time"
              value={data.scheduledTime}
              onChange={(e) =>
                onChange({ ...data, scheduledTime: e.target.value })
              }
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={() => onSubmit("draft")}
        >
          Save Draft
        </Button>
        <Button
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white"
          onClick={() => onSubmit("scheduled")}
          disabled={!data.content.trim() || data.platforms.length === 0}
        >
          Schedule Post
        </Button>
      </div>
    </div>
  );
}
