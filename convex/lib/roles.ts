import { DatabaseReader } from "../_generated/server";
import { Id } from "../_generated/dataModel";

/**
 * Resolve the current Convex user from a Clerk identity subject.
 * Returns null if no matching user found.
 */
export async function resolveUser(db: DatabaseReader, clerkSubject: string) {
  return await db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkSubject))
    .unique();
}

/**
 * Check a user's role in a workspace.
 * Returns the role string ("admin" | "editor" | "viewer") or null if not a member.
 */
export async function getWorkspaceRole(
  db: DatabaseReader,
  workspaceId: Id<"workspaces">,
  userId: Id<"users">,
): Promise<"admin" | "editor" | "viewer" | null> {
  const membership = await db
    .query("workspaceMembers")
    .withIndex("by_workspace_and_user", (q) =>
      q.eq("workspaceId", workspaceId).eq("userId", userId),
    )
    .unique();
  return membership?.role ?? null;
}

/**
 * Assert that the user has at least the required minimum role.
 * Throws if the user doesn't have access.
 *
 * Role hierarchy: admin > editor > viewer
 */
const roleHierarchy = { admin: 3, editor: 2, viewer: 1 } as const;

export function assertRole(
  actualRole: "admin" | "editor" | "viewer" | null,
  minimumRole: "admin" | "editor" | "viewer",
) {
  if (!actualRole) {
    throw new Error("You are not a member of this workspace");
  }
  if (roleHierarchy[actualRole] < roleHierarchy[minimumRole]) {
    throw new Error(
      `This action requires ${minimumRole} access or higher. You have ${actualRole} access.`,
    );
  }
}
