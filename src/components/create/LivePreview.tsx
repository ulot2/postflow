"use client";

import { PostFormData } from "./PostForm";
import {
  TwitterPreview,
  LinkedInPreview,
  InstagramPreview,
} from "../shared/PlatformPreviews";

export function LivePreview({ data }: { data: PostFormData }) {
  if (data.platforms.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50">
        <div className="w-16 h-16 mb-4 rounded-full bg-slate-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-slate-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </div>
        <p className="text-slate-500 font-medium">
          Select a platform to preview
        </p>
        <p className="text-slate-400 text-sm mt-1">
          Your post will appear here as you type
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-6 overflow-y-auto pb-6 custom-scrollbar pr-2">
      {data.platforms.includes("twitter") && (
        <TwitterPreview content={data.content} imageUrl={data.imageUrl} />
      )}
      {data.platforms.includes("linkedin") && (
        <LinkedInPreview content={data.content} imageUrl={data.imageUrl} />
      )}
      {data.platforms.includes("instagram") && (
        <InstagramPreview content={data.content} imageUrl={data.imageUrl} />
      )}
    </div>
  );
}
