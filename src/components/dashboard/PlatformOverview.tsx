"use client";

import {
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPinterest,
} from "react-icons/fa6";

import { Id } from "../../../convex/_generated/dataModel";

interface Post {
  _id: Id<"posts">;
  _creationTime: number;
  scheduledDate?: number;
  imageUrls?: string[];
  content: string;
  platform: "twitter" | "linkedin" | "instagram" | "pinterest";
  authorId: string;
  status: "draft" | "scheduled" | "published" | "failed" | "publishing";
}

export function PlatformOverview({ posts }: { posts: Post[] }) {
  // Aggregate post counts per platform
  const counts = {
    instagram: 0,
    twitter: 0,
    linkedin: 0,
    facebook: 0,
    pinterest: 0,
  };

  posts.forEach((post) => {
    // We safely coerce type to handle future extensions if needed
    if (post.platform === "instagram") counts.instagram++;
    if (post.platform === "twitter") counts.twitter++;
    if (post.platform === "linkedin") counts.linkedin++;
    if (post.platform === "pinterest") counts.pinterest++;
  });

  const platformsData = [
    {
      name: "Instagram",
      count: counts.instagram,
      icon: FaInstagram,
      color: "text-pink-500",
      bg: "bg-pink-50",
    },
    {
      name: "Twitter",
      count: counts.twitter,
      icon: FaXTwitter,
      color: "text-sky-500",
      bg: "bg-sky-50",
    },
    {
      name: "Linkedin",
      count: counts.linkedin,
      icon: FaLinkedinIn,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      name: "Pinterest",
      count: counts.pinterest,
      icon: FaPinterest,
      color: "text-red-500",
      bg: "bg-red-50",
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto mt-8 mb-12">
      <h2 className="text-xl font-bold tracking-tight text-slate-900 mb-4 px-1">
        Platform Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {platformsData.map((plat) => {
          const Icon = plat.icon;
          return (
            <div
              key={plat.name}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center gap-4 py-6"
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${plat.bg} ${plat.color}`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-slate-500 font-medium text-sm">
                  {plat.name}
                </p>
                <h3 className="text-2xl font-bold text-slate-900">
                  {plat.count}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
