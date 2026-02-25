import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export function useWorkspaceAccounts(
  workspaceId: Id<"workspaces"> | undefined,
) {
  const accounts = useQuery(
    api.accounts.getAccountsByWorkspace,
    workspaceId ? { workspaceId } : "skip", // Wait until workspaceId is loaded
  );

  return {
    accounts: accounts ?? [],
    isLoading: accounts === undefined,
  };
}
