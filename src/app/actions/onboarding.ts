"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function completeClerkOnboarding() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("No logged in user");
  }

  const client = await clerkClient();

  await client.users.updateUser(userId, {
    publicMetadata: {
      hasCompletedOnboarding: true,
    },
  });

  return { success: true };
}
