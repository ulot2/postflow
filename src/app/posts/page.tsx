"use client";

import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { useState } from "react";
import Link from "next/link";
import { Calendar, Trash2, Edit } from "lucide-react";
import { FaXTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa6";
import { format } from "date-fns";
import { Id } from "../../../convex/_generated/dataModel";
import { PostPreviewModal } from "@/components/shared/PostPreviewModal";
import { useWorkspace } from "@/components/providers/WorkspaceContext";

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
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePost({ id });
    }
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
              className="bg-white rounded-2xl border border-[#e0dbd3] p-5 shadow-xs flex flex-col h-[260px] hover:shadow-md hover:border-[#c5c0b8] transition-all cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {post.platform === "instagram" && (
                    <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center shrink-0">
                      <FaInstagram className="w-5 h-5" />
                    </div>
                  )}
                  {post.platform === "twitter" && (
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-500 flex items-center justify-center shrink-0">
                      <FaXTwitter className="w-5 h-5" />
                    </div>
                  )}
                  {post.platform === "linkedin" && (
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                      <FaLinkedinIn className="w-5 h-5 font-bold" />
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="font-bold text-[#0f0f0f] text-[15px] leading-tight">
                      {post.platform === "linkedin"
                        ? brandName
                        : `@${brandName.toLowerCase().replace(/\s+/g, "")}`}
                    </span>
                    <span className="text-[#6b6b6b] text-sm">
                      {post.platform === "instagram"
                        ? "Instagram"
                        : post.platform === "twitter"
                          ? "X"
                          : "LinkedIn"}
                    </span>
                  </div>
                </div>

                {post.status === "scheduled" && (
                  <span className="bg-blue-100 text-blue-600 px-2.5 py-1 rounded-full text-xs font-medium lowercase">
                    scheduled
                  </span>
                )}
                {post.status === "draft" && (
                  <span className="bg-amber-100 text-amber-600 px-2.5 py-1 rounded-full text-xs font-medium lowercase">
                    draft
                  </span>
                )}
                {post.status === "published" && (
                  <span className="bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-full text-xs font-medium lowercase">
                    published
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-hidden mb-4 mt-2">
                <p className="text-[#6b6b6b] text-[15px] line-clamp-3 break-all">
                  {post.content || (
                    <span className="text-transparent">
                      empty space to force height
                    </span>
                  )}
                </p>
              </div>

              <div className="mt-auto flex justify-between items-end gap-2 mb-4">
                <div className="flex items-start gap-2 text-[#6b6b6b]">
                  <Calendar className="w-4 h-4 mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {post.status === "draft"
                        ? "Draft saved "
                        : "Scheduled for "}
                      {post.scheduledDate
                        ? format(new Date(post.scheduledDate), "MMM d, yyyy")
                        : "No date"}
                    </span>
                    {post.scheduledDate && (
                      <span className="text-sm">
                        {format(new Date(post.scheduledDate), "h:mm a")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center gap-2 pt-4 border-t border-[#e0dbd3]">
                <Link
                  href={`/edit/${post._id}`}
                  passHref
                  className="flex-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="outline"
                    className="w-full h-10 text-[#0f0f0f] font-medium border-[#e0dbd3]"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="h-10 w-12 px-0 text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0 flex items-center justify-center border-[#e0dbd3]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(post._id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
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
