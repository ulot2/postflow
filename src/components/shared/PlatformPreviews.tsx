import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";
import {
  ThumbsUp,
  MessageCircle,
  Repeat2,
  Share2,
  Heart,
  ChartNoAxesColumn,
  Bookmark,
  Send,
} from "lucide-react";

interface PreviewProps {
  content: string;
  imageUrls?: string[];
  brandName?: string;
}

export function TwitterPreview({
  content,
  imageUrls,
  brandName = "Brand",
}: PreviewProps) {
  const handle = `@${brandName.toLowerCase().replace(/\s+/g, "")}`;

  return (
    <div className="bg-white border border-[#e0dbd3] rounded-xl p-4 shadow-xs">
      <div className="flex gap-3 mb-2">
        <Avatar className="w-10 h-10">
          <AvatarFallback className="bg-[#d4f24a] text-[#0f0f0f] font-bold text-xs">
            {brandName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <div className="flex items-center gap-1">
            <span className="font-bold text-[#0f0f0f] text-[15px]">
              {brandName}
            </span>
            <span className="text-[#6b6b6b] text-[15px]">{handle} · 1m</span>
          </div>
        </div>
      </div>
      <div className="pl-[52px]">
        <p className="text-[15px] text-[#0f0f0f] whitespace-pre-wrap break-all border-b border-transparent mb-2">
          {content || "What's happening?"}
        </p>
        {imageUrls && imageUrls.length > 0 && (
          <div
            className={`mt-2 rounded-xl overflow-hidden border border-[#e0dbd3] grid gap-0.5 ${
              imageUrls.length === 1
                ? "grid-cols-1 aspect-video"
                : imageUrls.length === 2
                  ? "grid-cols-2 aspect-video"
                  : imageUrls.length === 3
                    ? "grid-cols-2 aspect-video"
                    : "grid-cols-2 aspect-square"
            }`}
          >
            {imageUrls.map((url, i) => (
              <div
                key={i}
                className={`relative bg-[#f7f4ef] ${
                  imageUrls.length === 3 && i === 0 ? "row-span-2" : ""
                }`}
              >
                <Image
                  src={url}
                  alt={`Media ${i + 1}`}
                  width={100}
                  height={100}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}
        <div className="flex justify-between mt-3 text-[#6b6b6b] max-w-md">
          <div className="flex items-center hover:text-blue-500 cursor-pointer transition-colors">
            <MessageCircle className="w-4 h-4 mr-2" /> <span>31</span>
          </div>
          <div className="flex items-center hover:text-green-500 cursor-pointer transition-colors">
            <Repeat2 className="w-4 h-4 mr-2" /> <span>31</span>
          </div>
          <div className="flex items-center hover:text-red-500 cursor-pointer transition-colors">
            <Heart className="w-4 h-4 mr-2" /> <span>31</span>
          </div>
          <div className="flex items-center hover:text-blue-500 cursor-pointer transition-colors">
            <ChartNoAxesColumn className="w-4 h-4" /> <span>1M</span>
          </div>
          <div className="flex items-center gap-2 hover:text-blue-500 cursor-pointer transition-colors">
            <Bookmark className="w-4 h-4" />
            <Share2 className="w-4 h-4 mr-2" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function LinkedInPreview({
  content,
  imageUrls,
  brandName = "Brand",
}: PreviewProps) {
  return (
    <div className="bg-white border border-[#e0dbd3] rounded-xl p-4 shadow-xs">
      <div className="flex gap-3 mb-3">
        <Avatar className="w-12 h-12 rounded-md">
          <AvatarFallback className="bg-[#d4f24a] text-[#0f0f0f] rounded-md font-bold text-sm">
            {brandName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="font-bold text-[#0f0f0f] text-sm">{brandName}</span>
          <span className="text-[#6b6b6b] text-xs text-ellipsis">
            Content Creator | Developer
          </span>
          <span className="text-[#6b6b6b] text-xs flex items-center gap-1">
            1m • <div className="w-2 h-2 rounded-full bg-[#e0dbd3]" />
          </span>
        </div>
      </div>
      <div>
        <p className="text-sm text-[#0f0f0f] whitespace-pre-wrap break-all mb-3 text-ellipsis">
          {content || "What do you want to talk about?"}
        </p>
        {imageUrls && imageUrls.length > 0 && (
          <div
            className={`-mx-4 bg-[#f7f4ef] mt-2 grid gap-1 ${
              imageUrls.length === 1
                ? "grid-cols-1"
                : imageUrls.length === 2
                  ? "grid-cols-2 aspect-video"
                  : imageUrls.length === 3
                    ? "grid-cols-2 aspect-video"
                    : "grid-cols-2 aspect-square"
            }`}
          >
            {imageUrls.map((url, i) => (
              <div
                key={i}
                className={`relative bg-black/5 ${
                  imageUrls.length === 3 && i === 0 ? "row-span-2" : ""
                } ${imageUrls.length === 1 ? "aspect-square max-h-96" : "w-full h-full"}`}
              >
                <Image
                  src={url}
                  alt={`Media ${i + 1}`}
                  width={100}
                  height={100}
                  className={`${imageUrls.length === 1 ? "w-full h-auto max-h-96 object-contain" : "absolute inset-0 w-full h-full object-cover"}`}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-between border-t border-[#e0dbd3] mt-4 pt-2">
        <div className="flex-1 flex justify-center py-2 text-[#6b6b6b] text-sm font-medium hover:bg-[#f7f4ef] rounded-md transition-colors">
          <ThumbsUp className="w-4 h-4 mr-2" />
        </div>
        <div className="flex-1 flex justify-center py-2 text-[#6b6b6b] text-sm font-medium hover:bg-[#f7f4ef] rounded-md transition-colors">
          <MessageCircle className="w-4 h-4 mr-2" />
        </div>
        <div className="flex-1 flex justify-center py-2 text-[#6b6b6b] text-sm font-medium hover:bg-[#f7f4ef] rounded-md transition-colors">
          <Repeat2 className="w-4 h-4 mr-2" />
        </div>
        <div className="flex-1 flex justify-center py-2 text-[#6b6b6b] text-sm font-medium hover:bg-[#f7f4ef] rounded-md transition-colors">
          <Share2 className="w-4 h-4 mr-2" />
        </div>
      </div>
    </div>
  );
}

export function InstagramPreview({
  content,
  imageUrls,
  brandName = "Brand",
}: PreviewProps) {
  const handle = brandName.toLowerCase().replace(/\s+/g, "");

  return (
    <div className="bg-white border border-[#e0dbd3] rounded-xl shadow-xs max-w-[400px] mx-auto overflow-hidden">
      <div className="p-3 flex items-center gap-3 border-b border-[#e0dbd3]">
        <div className="w-8 h-8 rounded-full bg-linear-to-tr from-yellow-400 via-red-500 to-purple-500 p-[2px]">
          <Avatar className="w-full h-full border-2 border-white">
            <AvatarFallback className="bg-[#d4f24a] text-[#0f0f0f] text-xs font-bold">
              {brandName.charAt(0)}
            </AvatarFallback>
          </Avatar>
        </div>
        <span className="font-bold text-[#0f0f0f] text-sm">{handle}</span>
      </div>
      <div className="w-full aspect-square bg-[#f7f4ef] flex items-center justify-center overflow-hidden relative">
        {imageUrls && imageUrls.length > 0 ? (
          <>
            <Image
              src={imageUrls[0]}
              alt="Post media"
              width={100}
              height={100}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {imageUrls.length > 1 && (
              <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm z-10 flex items-center shadow-xs">
                <svg
                  className="w-3 h-3 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M4 6H20M4 12H20M4 18H20"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                1/{imageUrls.length}
              </div>
            )}
          </>
        ) : (
          <span className="text-[#6b6b6b]">Media Area</span>
        )}
      </div>
      <div className="p-3">
        <div className="flex gap-4 mb-2">
          <Heart className="w-6 h-6 rounded-full hover:text-red-500 cursor-pointer transition-colors" />
          <MessageCircle className="w-6 h-6 rounded-full hover:text-blue-500 cursor-pointer transition-colors" />
          <Repeat2 className="w-6 h-6 rounded-full hover:text-green-500 cursor-pointer transition-colors" />
          <Send className="w-6 h-6 rounded-full hover:text-blue-500 cursor-pointer transition-colors" />
        </div>
        <p className="text-sm text-[#0f0f0f]">
          <span className="font-bold mr-2">{handle}</span>
          <span className="whitespace-pre-wrap break-all">
            {content || "Write a caption..."}
          </span>
        </p>
      </div>
    </div>
  );
}

export function PinterestPreview({
  content,
  imageUrls,
  brandName = "Brand",
}: PreviewProps) {
  const [title, ...descParts] = content.split("\n");
  const description = descParts.join("\n").trim();

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xs max-w-[300px] mx-auto border border-[#e0dbd3]">
      <div className="relative w-full aspect-2/3 bg-[#f7f4ef] overflow-hidden">
        {imageUrls && imageUrls.length > 0 ? (
          <Image
            src={imageUrls[0]}
            alt="Pinterest preview"
            width={100}
            height={100}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-[#6b6b6b] p-6 text-center border-b border-[#e0dbd3]">
            {title ? (
              <span className="font-bold text-xl text-[#0f0f0f]">{title}</span>
            ) : (
              <span>Image Required for Pinterest</span>
            )}
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-bold text-[#0f0f0f] text-lg leading-tight line-clamp-2 wrap-break-word">
            {title || "Pin Title"}
          </h3>
          <div className="bg-[#E60023] text-white rounded-full px-4 py-2 shrink-0 cursor-pointer text-sm font-bold">
            Save
          </div>
        </div>

        {description && (
          <p className="text-[#0f0f0f] text-sm line-clamp-3 mb-2">
            {description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-2">
          <Avatar className="w-8 h-8 rounded-full border border-[#e0dbd3]">
            <AvatarFallback className="bg-[#f7f4ef] text-[#0f0f0f] text-xs font-bold">
              {brandName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-[#0f0f0f] text-sm font-medium">
            {brandName}
          </span>
        </div>
      </div>
    </div>
  );
}
