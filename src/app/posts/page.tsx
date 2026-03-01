"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import Link from "next/link";
import { Calendar, Trash2, Edit } from "lucide-react";
import {
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPinterestP,
} from "react-icons/fa6";
import { format } from "date-fns";
import { Id } from "../../../convex/_generated/dataModel";
import { PostPreviewModal } from "@/components/shared/PostPreviewModal";
import { useWorkspace } from "@/components/providers/WorkspaceContext";
import { ConfirmDeletePopover } from "@/components/shared/ConfirmDeletePopover";
import { toast } from "sonner";

type FilterStatus = "all" | "draft" | "scheduled" | "published";

export default function PostsPage() {
  const { activeWorkspace } = useWorkspace();
  const posts = useQuery(
    api.posts.getPosts,
    activeWorkspace ? { workspaceId: activeWorkspace._id } : "skip",
  );
  const deletePost = useMutation(api.posts.deletePost);
  const [filter, setFilter] = useState<FilterStatus>("all");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  const counts: Record<string, number> = {
    all: posts?.length || 0,
    drafts: posts?.filter((p) => p.status === "draft").length || 0,
    scheduled: posts?.filter((p) => p.status === "scheduled").length || 0,
    published: posts?.filter((p) => p.status === "published").length || 0,
  };

  const filteredPosts = posts?.filter((post) => {
    if (filter === "all") return true;
    return post.status === filter;
  });

  const handleDelete = async (id: Id<"posts">) => {
    await deletePost({ id });
    toast.success("Post deleted");
  };

  const brandName = activeWorkspace?.name ?? "Brand";

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#f7f4ef] flex flex-col">
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0f0f0f] mb-1 font-syne">
              Posts
            </h1>
            <p className="text-[#6b6b6b]">
              Manage all your content in one place
            </p>
          </div>
          <Link href="/create" passHref>
            <Button className="bg-[#0f0f0f] text-[#d4f24a] hover:opacity-90 font-syne font-bold px-6 py-5 rounded-xl shadow-md">
              Create New Post
            </Button>
          </Link>
        </header>

        <div className="flex bg-white border border-[#e0dbd3] rounded-full p-1.5 w-fit mb-8 gap-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
              filter === "all"
                ? "bg-[#0f0f0f] text-[#d4f24a] shadow-sm"
                : "text-[#6b6b6b] hover:text-[#0f0f0f]"
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
              filter === "draft"
                ? "bg-[#0f0f0f] text-[#d4f24a] shadow-sm"
                : "text-[#6b6b6b] hover:text-[#0f0f0f]"
            }`}
          >
            Drafts ({counts.drafts})
          </button>
          <button
            onClick={() => setFilter("scheduled")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
              filter === "scheduled"
                ? "bg-[#0f0f0f] text-[#d4f24a] shadow-sm"
                : "text-[#6b6b6b] hover:text-[#0f0f0f]"
            }`}
          >
            Scheduled ({counts.scheduled})
          </button>
          <button
            onClick={() => setFilter("published")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all cursor-pointer ${
              filter === "published"
                ? "bg-[#0f0f0f] text-[#d4f24a] shadow-sm"
                : "text-[#6b6b6b] hover:text-[#0f0f0f]"
            }`}
          >
            Published ({counts.published})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts?.map((post) => (
            <div
              key={post._id}
              className="group relative bg-white rounded-3xl border border-[#e0dbd3] overflow-hidden shadow-sm flex flex-col hover:shadow-2xl hover:shadow-black/5 hover:-translate-y-1 transition-all duration-400 cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              {/* Subtle top gradient depending on platform */}
              <div
                className={`absolute top-0 left-0 right-0 h-1.5 opacity-80 ${
                  post.platform === "instagram"
                    ? "bg-linear-to-r from-pink-500 to-amber-500"
                    : post.platform === "twitter"
                      ? "bg-black"
                      : post.platform === "pinterest"
                        ? "bg-[#E60023]"
                        : "bg-[#0a66c2]"
                }`}
              />

              <div className="flex flex-col flex-1 p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4 mt-1">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex shrink-0 items-center justify-center w-10 h-10 rounded-2xl ${
                        post.platform === "instagram"
                          ? "bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-500 text-white shadow-inner"
                          : post.platform === "twitter"
                            ? "bg-black text-white shadow-inner"
                            : post.platform === "pinterest"
                              ? "bg-[#E60023] text-white shadow-inner"
                              : "bg-[#0a66c2] text-white shadow-inner"
                      }`}
                    >
                      {post.platform === "instagram" && (
                        <FaInstagram className="w-5 h-5" />
                      )}
                      {post.platform === "twitter" && (
                        <FaXTwitter className="w-5 h-5" />
                      )}
                      {post.platform === "pinterest" && (
                        <FaPinterestP className="w-5 h-5" />
                      )}
                      {post.platform === "linkedin" && (
                        <FaLinkedinIn className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-extrabold text-[#0f0f0f] text-[16px] tracking-tight leading-none mb-1">
                        {brandName}
                      </span>
                      <span className="text-[#8c8c8c] text-[13px] font-medium leading-none">
                        {post.platform === "instagram"
                          ? "Instagram Post"
                          : post.platform === "twitter"
                            ? "X (Twitter) Post"
                            : post.platform === "pinterest"
                              ? "Pinterest Pin"
                              : "LinkedIn Post"}
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 ml-2">
                    {post.status === "scheduled" && (
                      <span className="bg-[#f0fdce] text-[#4a5c0a] border border-[#d4f24a]/40 px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest shadow-sm">
                        Scheduled
                      </span>
                    )}
                    {post.status === "draft" && (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200/50 px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest shadow-sm">
                        Draft
                      </span>
                    )}
                    {post.status === "published" && (
                      <span className="bg-[#f5f5f5] text-[#333333] border border-[#e0e0e0] px-2.5 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest shadow-sm">
                        Published
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 mb-6 relative">
                  <p className="text-[#3b3b3b] text-[15px] font-medium leading-relaxed line-clamp-4 wrap-break-word whitespace-pre-wrap">
                    {post.content || (
                      <span className="text-[#a0a0a0] italic font-normal">
                        No text content for this post...
                      </span>
                    )}
                  </p>
                  {/* Subtle fade-out at bottom if text is long */}
                  <div className="absolute bottom-0 left-0 right-0 h-8 bg-linear-to-t from-white to-transparent pointer-events-none" />
                </div>

                {/* Footer details */}
                <div className="mt-auto pt-4 border-t border-[#f0ebe1] flex items-center justify-between">
                  {/* Date & Time */}
                  <div className="flex items-center gap-2 text-[#6b6b6b] bg-[#faf8f4] px-3 py-1.5 rounded-xl border border-[#e0dbd3]/50">
                    <Calendar className="w-4 h-4 text-[#8c8c8c]" />
                    <span className="text-[13px] font-semibold tracking-tight">
                      {post.scheduledDate
                        ? format(new Date(post.scheduledDate), "MMM d, h:mm a")
                        : "Unscheduled"}
                    </span>
                  </div>

                  {/* Actions (visible on hover) */}
                  <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300">
                    <Link
                      href={`/edit/${post._id}`}
                      passHref
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-xl text-[#6b6b6b] hover:text-[#0f0f0f] hover:bg-[#f0ebe1] transition-colors"
                      title="Edit Post"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <ConfirmDeletePopover
                      onConfirm={() => {
                        handleDelete(post._id);
                      }}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="p-2 rounded-xl text-[#6b6b6b] hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </ConfirmDeletePopover>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredPosts?.length === 0 && (
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-[#6b6b6b] bg-white rounded-2xl border border-dashed border-[#e0dbd3]">
              <p>No posts found for this filter.</p>
            </div>
          )}
        </div>
      </main>

      <PostPreviewModal
        post={selectedPost}
        isOpen={selectedPost !== null}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
}
