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
} from "./PlatformPreviews";
import { Calendar, Info, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { format } from "date-fns";
import Link from "next/link";
import { Id } from "../../../convex/_generated/dataModel";
import { useWorkspace } from "@/components/providers/WorkspaceContext";

interface Post {
  _id: Id<"posts">;
  _creationTime: number;
  scheduledDate?: number;
  imageUrl?: string;
  content: string;
  platform: "twitter" | "linkedin" | "instagram";
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

  const handleDelete = async () => {
    if (!post) return;
    if (confirm("Are you sure you want to delete this post?")) {
      await deletePost({ id: post._id });
      onClose();
    }
  };

  if (!post) return null;

  const brandName = activeWorkspace?.name ?? "Brand";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[85vh] overflow-y-auto custom-scrollbar flex flex-col pt-8 bg-[#f7f4ef] border-[#e0dbd3]">
        <DialogHeader className="mb-4">
          <DialogTitle className="flex items-center gap-2 text-[#0f0f0f] font-syne">
            Post Preview
            {post.status === "scheduled" && (
              <span className="bg-blue-100 text-blue-600 px-2.5 py-0.5 rounded-full text-xs font-medium lowercase">
                scheduled
              </span>
            )}
            {post.status === "draft" && (
              <span className="bg-amber-100 text-amber-600 px-2.5 py-0.5 rounded-full text-xs font-medium lowercase">
                draft
              </span>
            )}
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-2 mt-2">
            <span className="flex items-center gap-2 text-[#6b6b6b]">
              <Calendar className="w-4 h-4 shrink-0" />
              <span>
                {post.status === "draft" ? "Draft saved " : "Scheduled for "}
                {post.scheduledDate
                  ? format(
                      new Date(post.scheduledDate),
                      "MMM d, yyyy 'at' h:mm a",
                    )
                  : "No date set"}
              </span>
            </span>
            <span className="flex items-center gap-2 text-[#6b6b6b]">
              <Info className="w-4 h-4 shrink-0" />
              <span className="capitalize">
                {post.platform} formatting applied
              </span>
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="bg-white -mx-6 p-6 border-t border-[#e0dbd3] flex-1">
          {post.platform === "twitter" && (
            <TwitterPreview
              content={post.content}
              imageUrl={post.imageUrl}
              brandName={brandName}
            />
          )}
          {post.platform === "linkedin" && (
            <LinkedInPreview
              content={post.content}
              imageUrl={post.imageUrl}
              brandName={brandName}
            />
          )}
          {post.platform === "instagram" && (
            <InstagramPreview
              content={post.content}
              imageUrl={post.imageUrl}
              brandName={brandName}
            />
          )}
        </div>

        <div className="flex justify-between items-center gap-2 pt-4 mt-2 border-t border-[#e0dbd3]">
          <Link href={`/edit/${post._id}`} passHref className="flex-1">
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
            onClick={handleDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
