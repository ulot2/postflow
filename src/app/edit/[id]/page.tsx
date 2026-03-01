"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PostForm, PostFormData } from "@/components/create/PostForm";
import { LivePreview } from "@/components/create/LivePreview";
import { useMutation, useQuery } from "convex/react";
import { useRouter, useParams } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { format } from "date-fns";
import { toast } from "sonner";

export default function EditPostPage() {
  const params = useParams();
  const postId = params.id as Id<"posts">;

  const post = useQuery(api.posts.getPost, { id: postId });

  if (post === undefined) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center bg-[#f7f4ef]">
          <div className="w-8 h-8 border-4 border-[#0f0f0f] border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center text-[#6b6b6b] bg-[#f7f4ef]">
          Post not found
        </main>
      </div>
    );
  }

  return <EditPostContent post={post} postId={postId} />;
}

function EditPostContent({
  post,
  postId,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  post: any;
  postId: Id<"posts">;
}) {
  const router = useRouter();
  const updatePost = useMutation(api.posts.updatePost);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<PostFormData>(() => {
    let scheduledDate = new Date().toISOString().split("T")[0];
    let scheduledTime = "12:00";

    if (post.scheduledDate) {
      const d = new Date(post.scheduledDate);
      scheduledDate = format(d, "yyyy-MM-dd");
      scheduledTime = format(d, "HH:mm");
    }

    return {
      content: post.content,
      imageUrls: post.imageUrls || [],
      imageIds: post.imageIds || [],
      platforms: [post.platform],
      scheduledDate,
      scheduledTime,
    };
  });

  const handleSubmit = async (status: "draft" | "scheduled") => {
    setIsSubmitting(true);

    try {
      const scheduledDateTs = new Date(
        `${formData.scheduledDate}T${formData.scheduledTime}`,
      ).getTime();

      await updatePost({
        id: postId,
        content: formData.content,
        status,
        imageUrls: formData.imageUrls,
        imageIds: formData.imageIds,
        scheduledDate: status === "scheduled" ? scheduledDateTs : undefined,
      });

      toast.success("Post updated");
      router.push("/posts");
    } catch (error) {
      console.error("Failed to update post", error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f7f4ef] flex flex-col">
        <header className="flex justify-between items-center mb-6 bg-white border border-[#e0dbd3] p-4 shrink-0 rounded-xl">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0f0f0f] font-syne">
              Edit Post
            </h2>
            <p className="text-sm text-[#6b6b6b]">Modify your existing post</p>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" passHref>
              <Button variant="outline" className="shadow-sm border-[#e0dbd3]">
                Cancel
              </Button>
            </Link>
          </div>
        </header>

        {/* Side-by-side Form and Preview */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          {/* Left Side: Form */}
          <div className="w-full lg:w-[45%] flex flex-col h-full bg-white rounded-2xl shadow-sm border border-[#e0dbd3] p-6 overflow-y-auto custom-scrollbar relative">
            {isSubmitting && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-xs z-10 flex items-center justify-center rounded-2xl">
                <div className="w-8 h-8 border-4 border-[#0f0f0f] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <PostForm
              key={post._id}
              data={formData}
              onChange={setFormData}
              onSubmit={handleSubmit}
              isEditing={true}
            />
          </div>

          {/* Right Side: Preview */}
          <div className="w-full lg:w-[55%] flex flex-col h-full bg-white/50 rounded-2xl shadow-inner border border-[#e0dbd3] p-6 overflow-y-auto custom-scrollbar relative">
            <h3 className="text-lg font-semibold text-[#0f0f0f] mb-4 shrink-0 px-2 flex items-center gap-2 font-syne">
              <svg
                className="w-5 h-5 text-[#6b6b6b]"
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
