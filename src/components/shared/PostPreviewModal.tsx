"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  TwitterPreview,
  LinkedInPreview,
  InstagramPreview,
  PinterestPreview,
} from "./PlatformPreviews";
import { Calendar, Info, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { format } from "date-fns";
import Link from "next/link";
import { Id } from "../../../convex/_generated/dataModel";
import { useWorkspace } from "@/components/providers/WorkspaceContext";
import { ConfirmDeletePopover } from "./ConfirmDeletePopover";
import { toast } from "sonner";

interface Post {
  _id: Id<"posts">;
  _creationTime: number;
  scheduledDate?: number;
  imageUrls?: string[];
  content: string;
  platform: "twitter" | "linkedin" | "instagram" | "pinterest";
  authorId: string;
  status: "draft" | "scheduled" | "published";
}

interface PostPreviewModalProps {
  post: Post | null;
  isOpen: boolean;
  onClose: () => void;
}

export function PostPreviewModal({
  post,
  isOpen,
  onClose,
}: PostPreviewModalProps) {
  const deletePost = useMutation(api.posts.deletePost);
  const { activeWorkspace } = useWorkspace();

  const confirmDelete = async () => {
    if (!post) return;
    await deletePost({ id: post._id });
    toast.success("Post deleted");
    onClose();
  };

  if (!post) return null;

  const brandName = activeWorkspace?.name ?? "Brand";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
        <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto custom-scrollbar flex flex-col pt-8 bg-[#f7f4ef] border-[#e0dbd3]">
          <DialogHeader className="mb-4 flex flex-row items-start justify-between pe-8">
            <div className="flex flex-col gap-2">
              <DialogTitle className="flex items-center gap-2 text-[#0f0f0f] font-syne">
                Post Preview
                {post.status === "scheduled" && (
                  <span className="bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase">
                    scheduled
                  </span>
                )}
                {post.status === "draft" && (
                  <span className="bg-slate-200 text-slate-700 px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase">
                    draft
                  </span>
                )}
              </DialogTitle>
              <DialogDescription className="flex flex-col gap-2 mt-2 text-left">
                <span className="flex items-center gap-2 text-slate-500">
                  <Calendar className="w-4 h-4 shrink-0" />
                  <span>
                    {post.status === "draft"
                      ? "Draft saved "
                      : "Scheduled for "}
                    {post.scheduledDate
                      ? format(
                          new Date(post.scheduledDate),
                          "MMM d, yyyy 'at' h:mm a",
                        )
                      : "No date set"}
                  </span>
                </span>
                <span className="flex items-center gap-2 text-slate-500">
                  <Info className="w-4 h-4 shrink-0" />
                  <span className="capitalize">
                    {post.platform} formatting applied
                  </span>
                </span>
              </DialogDescription>
            </div>

            <div className="flex items-center gap-2 absolute top-6 right-12 z-10">
              <Link href={`/edit/${post._id}`} passHref>
                <Button
                  variant="outline"
                  size="icon"
                  title="Edit Post"
                  className="h-9 w-9 text-slate-600 bg-white shadow-xs border-slate-200 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300 rounded-lg transition-all"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </Link>
              <ConfirmDeletePopover onConfirm={confirmDelete}>
                <Button
                  variant="outline"
                  size="icon"
                  title="Delete Post"
                  className="h-9 w-9 text-red-500 bg-white shadow-xs border-slate-200 hover:text-red-700 hover:bg-red-50 hover:border-red-200 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </ConfirmDeletePopover>
            </div>
          </DialogHeader>

          <div className="bg-white -mx-6 p-6 border-t border-[#e0dbd3] flex-1">
            {post.platform === "twitter" && (
              <TwitterPreview
                content={post.content}
                imageUrls={post.imageUrls}
                brandName={brandName}
              />
            )}
            {post.platform === "linkedin" && (
              <LinkedInPreview
                content={post.content}
                imageUrls={post.imageUrls}
                brandName={brandName}
              />
            )}
            {post.platform === "instagram" && (
              <InstagramPreview
                content={post.content}
                imageUrls={post.imageUrls}
                brandName={brandName}
              />
            )}
            {post.platform === "pinterest" && (
              <PinterestPreview
                content={post.content}
                imageUrls={post.imageUrls}
                brandName={brandName}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
