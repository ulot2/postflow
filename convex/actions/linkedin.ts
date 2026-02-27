"use node";
import { action } from "../_generated/server";
import { v } from "convex/values";
import { api, internal } from "../_generated/api";

export const publish = action({
  args: {
    postId: v.id("posts"),
    workspaceId: v.id("workspaces"),
    content: v.string(),
    platform: v.literal("linkedin"),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      // 1. Get the connected LinkedIn account for this workspace
      const accounts = await ctx.runQuery(
        internal.accounts.getAccountsByWorkspaceInternal,
        {
          workspaceId: args.workspaceId,
        },
      );

      const linkedinAccount = accounts.find((a) => a.platform === "linkedin");

      if (!linkedinAccount || !linkedinAccount.accessToken) {
        throw new Error(
          "No connected LinkedIn account found for this workspace",
        );
      }

      const personUrn = `urn:li:person:${linkedinAccount.platformAccountId}`;
      let assetUrn: string | undefined;

      // 2. If there's an image, we need to upload it to LinkedIn first
      if (args.imageUrl) {
        // Download the image
        const imageRes = await fetch(args.imageUrl);
        if (!imageRes.ok) throw new Error("Failed to download image to upload");
        const imageBuffer = await imageRes.arrayBuffer();

        // Register the upload
        const registerBody = {
          registerUploadRequest: {
            recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
            owner: personUrn,
            serviceRelationships: [
              {
                relationshipType: "OWNER",
                identifier: "urn:li:userGeneratedContent",
              },
            ],
          },
        };

        const registerRes = await fetch(
          "https://api.linkedin.com/v2/assets?action=registerUpload",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${linkedinAccount.accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(registerBody),
          },
        );

        if (!registerRes.ok) {
          throw new Error(
            `Failed to register upload: ${await registerRes.text()}`,
          );
        }

        const registerData = await registerRes.json();
        const uploadUrl =
          registerData.value.uploadMechanism[
            "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
          ].uploadUrl;
        assetUrn = registerData.value.asset;

        // Upload the actual binary chunks
        const uploadRes = await fetch(uploadUrl, {
          method: "POST", // The docs say POST or PUT, url signed handles it
          body: imageBuffer,
        });

        if (!uploadRes.ok) {
          throw new Error(
            `Failed to upload image to LinkedIn: ${await uploadRes.text()}`,
          );
        }
      }

      // 3. Publish to LinkedIn API
      const shareContent: Record<string, unknown> = {
        shareCommentary: {
          text: args.content,
        },
        shareMediaCategory: assetUrn ? "IMAGE" : "NONE",
      };

      if (assetUrn) {
        shareContent.media = [
          {
            status: "READY",
            description: { text: "Post image" },
            media: assetUrn,
          },
        ];
      }

      const specificContent = {
        "com.linkedin.ugc.ShareContent": shareContent,
      };

      const response = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${linkedinAccount.accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: personUrn,
          lifecycleState: "PUBLISHED",
          specificContent,
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("LinkedIn API Error:", errorText);
        throw new Error(
          `LinkedIn API returned ${response.status}: ${errorText}`,
        );
      }

      // 3. Update the post status to published
      await ctx.runMutation(api.posts.updatePostStatus, {
        id: args.postId,
        status: "published",
      });

      return { success: true };
    } catch (error) {
      console.error("Failed to publish to LinkedIn:", error);

      // Update the post status to failed
      await ctx.runMutation(api.posts.updatePostStatus, {
        id: args.postId,
        status: "failed",
      });

      throw error;
    }
  },
});
