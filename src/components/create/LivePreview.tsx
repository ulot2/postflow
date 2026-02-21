"use client";

import { PostFormData } from "./PostForm";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

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

function TwitterPreview({
  content,
  imageUrl,
}: {
  content: string;
  imageUrl?: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
      <div className="flex gap-3 mb-2">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-slate-200">U</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-bold text-slate-900 text-[15px]">You</span>
            <span className="text-slate-500 text-[15px]">@username · 1m</span>
          </div>
        </div>
      </div>
      <div className="pl-[52px]">
        <p className="text-[15px] text-slate-900 whitespace-pre-wrap break-all border-b border-transparent mb-2">
          {content || "What's happening?"}
        </p>
        {imageUrl && (
          <div className="mt-2 rounded-xl overflow-hidden border border-slate-200">
            <img
              src={imageUrl}
              alt="Post media"
              className="w-full h-auto max-h-80 object-cover"
            />
          </div>
        )}
        <div className="flex justify-between mt-3 text-slate-500 max-w-md">
          <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors">
            <div className="w-5 h-5 rounded-full bg-slate-100" />
          </div>
          <div className="flex items-center gap-2 hover:text-green-500 cursor-pointer transition-colors">
            <div className="w-5 h-5 rounded-full bg-slate-100" />
          </div>
          <div className="flex items-center gap-2 hover:text-red-500 cursor-pointer transition-colors">
            <div className="w-5 h-5 rounded-full bg-slate-100" />
          </div>
          <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors">
            <div className="w-5 h-5 rounded-full bg-slate-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkedInPreview({
  content,
  imageUrl,
}: {
  content: string;
  imageUrl?: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
      <div className="flex gap-3 mb-3">
        <Avatar className="w-12 h-12 rounded-md">
          <AvatarFallback className="bg-slate-200 rounded-md">U</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 text-sm">Your Name</span>
          <span className="text-slate-500 text-xs text-ellipsis">
            Content Creator | Developer
          </span>
          <span className="text-slate-500 text-xs flex items-center gap-1">
            1m • <div className="w-2 h-2 rounded-full bg-slate-300" />
          </span>
        </div>
      </div>
      <div>
        <p className="text-sm text-slate-900 whitespace-pre-wrap break-all mb-3 text-ellipsis">
          {content || "What do you want to talk about?"}
        </p>
        {imageUrl && (
          <div className="-mx-4 bg-slate-100 mt-2">
            <img
              src={imageUrl}
              alt="Post media"
              className="w-full h-auto max-h-96 object-contain"
            />
          </div>
        )}
      </div>
      <div className="flex justify-between border-t border-slate-100 mt-4 pt-2">
        <div className="flex-1 flex justify-center py-2 text-slate-500 text-sm font-medium hover:bg-slate-50 rounded-md transition-colors">
          Like
        </div>
        <div className="flex-1 flex justify-center py-2 text-slate-500 text-sm font-medium hover:bg-slate-50 rounded-md transition-colors">
          Comment
        </div>
        <div className="flex-1 flex justify-center py-2 text-slate-500 text-sm font-medium hover:bg-slate-50 rounded-md transition-colors">
          Repost
        </div>
        <div className="flex-1 flex justify-center py-2 text-slate-500 text-sm font-medium hover:bg-slate-50 rounded-md transition-colors">
          Send
        </div>
      </div>
    </div>
  );
}

function InstagramPreview({
  content,
  imageUrl,
}: {
  content: string;
  imageUrl?: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xs max-w-[400px] mx-auto overflow-hidden">
      <div className="p-3 flex items-center gap-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
          <Avatar className="w-full h-full border-2 border-white">
            <AvatarFallback className="bg-slate-200 text-xs">U</AvatarFallback>
          </Avatar>
        </div>
        <span className="font-bold text-slate-900 text-sm">username</span>
      </div>
      <div className="w-full aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Post media"
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-slate-400">Media Area</span>
        )}
      </div>
      <div className="p-3">
        <div className="flex gap-4 mb-2">
          <div className="w-6 h-6 rounded-full bg-slate-200" />
          <div className="w-6 h-6 rounded-full bg-slate-200" />
          <div className="w-6 h-6 rounded-full bg-slate-200" />
        </div>
        <p className="text-sm text-slate-900">
          <span className="font-bold mr-2">username</span>
          <span className="whitespace-pre-wrap break-all">
            {content || "Write a caption..."}
          </span>
        </p>
      </div>
    </div>
  );
}
