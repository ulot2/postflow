"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PostForm, PostFormData } from "@/components/create/PostForm";
import { LivePreview } from "@/components/create/LivePreview";
import { useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { api } from "../../../convex/_generated/api";

export default function CreatePostPage() {
  const router = useRouter();
  const createPost = useMutation(api.posts.createPost);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<PostFormData>({
    content: "",
    imageUrl: "",
    platforms: ["twitter"],
    scheduledDate: new Date().toISOString().split("T")[0],
    scheduledTime: "12:00",
  });

  const handleSubmit = async (status: "draft" | "scheduled") => {
    setIsSubmitting(true);

    try {
      const scheduledDateTs = new Date(
        `${formData.scheduledDate}T${formData.scheduledTime}`,
      ).getTime();

      await Promise.all(
        formData.platforms.map((platform) =>
          createPost({
            content: formData.content,
            platform: platform as "twitter" | "linkedin" | "instagram",
            authorId: "user-1", // Match MOCK_AUTHOR_ID in Calendar
            status,
            scheduledDate: status === "scheduled" ? scheduledDateTs : undefined,
          }),
        ),
      );

      router.push("/");
    } catch (error) {
      console.error("Failed to create post(s)", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 flex flex-col">
        <header className="flex justify-between items-center mb-6 glass-card p-4 shrink-0 shadow-xs border border-white/40 rounded-2xl">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Create Post
            </h2>
            <p className="text-sm text-slate-500">
              Draft a new post and preview how it looks
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" passHref>
              <Button variant="outline" className="shadow-sm">
                Cancel
              </Button>
            </Link>
            <Avatar className="w-10 h-10 border border-slate-300">
              <AvatarImage src="" />
              <AvatarFallback className="bg-slate-200 text-slate-600 font-medium">
                U
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Side-by-side Form and Preview */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          {/* Left Side: Form */}
          <div className="w-full lg:w-[45%] flex flex-col h-full bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-y-auto custom-scrollbar relative">
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-xs z-10 flex items-center justify-center rounded-2xl">
                <div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <PostForm
              data={formData}
              onChange={setFormData}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Right Side: Preview */}
          <div className="w-full lg:w-[55%] flex flex-col h-full bg-slate-100 rounded-2xl shadow-inner border border-slate-200 p-6 overflow-y-auto custom-scrollbar relative">
            <h3 className="text-lg font-semibold text-slate-800 mb-4 shrink-0 px-2 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-slate-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Live Preview
            </h3>
            <LivePreview data={formData} />
          </div>
        </div>
      </main>
    </div>
  );
}
