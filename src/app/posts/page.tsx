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

type FilterStatus = "all" | "draft" | "scheduled" | "published";

export default function PostsPage() {
  const posts = useQuery(api.posts.getPosts);
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

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-1">
              Posts
            </h1>
            <p className="text-slate-500">
              Manage all your content in one place
            </p>
          </div>
          <Link href="/create" passHref>
            <Button className="bg-[#0A0D14] hover:bg-black text-white px-6 py-5 rounded-lg font-medium shadow-md">
              Create New Post
            </Button>
          </Link>
        </header>

        {/* Filter Tabs */}
        <div className="flex bg-slate-100 rounded-full p-1.5 w-fit mb-8 gap-1">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === "all"
                ? "bg-white shadow-sm text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All ({counts.all})
          </button>
          <button
            onClick={() => setFilter("draft")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === "draft"
                ? "bg-white shadow-sm text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Drafts ({counts.drafts})
          </button>
          <button
            onClick={() => setFilter("scheduled")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === "scheduled"
                ? "bg-white shadow-sm text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Scheduled ({counts.scheduled})
          </button>
          <button
            onClick={() => setFilter("published")}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === "published"
                ? "bg-white shadow-sm text-slate-900"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Published ({counts.published})
          </button>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPosts?.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col h-[260px] hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              {/* Card Header */}
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
                    {post.platform === "instagram" && (
                      <>
                        <span className="font-bold text-slate-900 text-[15px] leading-tight">
                          @brandname
                        </span>
                        <span className="text-slate-500 text-sm">
                          Instagram
                        </span>
                      </>
                    )}
                    {post.platform === "twitter" && (
                      <>
                        <span className="font-bold text-slate-900 text-[15px] leading-tight">
                          @brandname
                        </span>
                        <span className="text-slate-500 text-sm">X</span>
                      </>
                    )}
                    {post.platform === "linkedin" && (
                      <>
                        <span className="font-bold text-slate-900 text-[15px] leading-tight">
                          Brand Name
                        </span>
                        <span className="text-slate-500 text-sm">Linkedin</span>
                      </>
                    )}
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

              {/* Card Content */}
              <div className="flex-1 overflow-hidden mb-4 mt-2">
                <p className="text-slate-600 text-[15px] line-clamp-3 break-all">
                  {post.content || (
                    <span className="text-transparent">
                      empty space to force height
                    </span>
                  )}
                </p>
              </div>

              {/* Date */}
              <div className="mt-auto flex justify-between items-end gap-2 mb-4">
                <div className="flex items-start gap-2 text-slate-500">
                  <Calendar className="w-4 h-4 mt-0.5 shrink-0" />
                  <div className="flex flex-col">
                    <span className="text-sm">
                      {post.status === "draft"
                        ? "Draft saved"
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

              {/* Buttons */}
              <div className="flex justify-between items-center gap-2 pt-4 border-t border-slate-100">
                <Link
                  href={`/edit/${post._id}`}
                  passHref
                  className="flex-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    variant="outline"
                    className="w-full h-10 text-slate-700 font-medium border-slate-200"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="h-10 w-12 px-0 text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0 flex items-center justify-center border-slate-200"
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
            <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 bg-white rounded-2xl border border-dashed border-slate-300">
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
