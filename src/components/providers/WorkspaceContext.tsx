"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

type Workspace = {
  _id: Id<"workspaces">;
  name: string;
  description?: string;
  type: "personal" | "company";
  userId: Id<"users">;
  brandLogoUrl?: string;
  brandLogoId?: Id<"_storage">;
};

type WorkspaceContextType = {
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  setActiveWorkspace: (id: Id<"workspaces">) => void;
  isLoading: boolean;
};

const WorkspaceContext = createContext<WorkspaceContextType>({
  workspaces: [],
  activeWorkspace: null,
  setActiveWorkspace: () => {},
  isLoading: true,
});

const STORAGE_KEY = "postflow_active_workspace";

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const workspaces = useQuery(api.workspaces.getUserWorkspaces);
  const [activeId, setActiveId] = useState<Id<"workspaces"> | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (stored as Id<"workspaces">) : null;
  });

  // When workspaces load, set default if stored ID is invalid or missing
  useEffect(() => {
    if (!workspaces || workspaces.length === 0) return;

    const validId = workspaces.find((ws) => ws._id === activeId);
    if (!validId) {
      const firstId = workspaces[0]._id;
      setActiveId(firstId);
      localStorage.setItem(STORAGE_KEY, firstId);
    }
  }, [workspaces, activeId]);

  const setActiveWorkspace = useCallback((id: Id<"workspaces">) => {
    setActiveId(id);
    localStorage.setItem(STORAGE_KEY, id);
  }, []);

  const activeWorkspace =
    (workspaces ?? []).find((ws) => ws._id === activeId) ?? null;

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces: (workspaces ?? []) as Workspace[],
        activeWorkspace: activeWorkspace as Workspace | null,
        setActiveWorkspace,
        isLoading: workspaces === undefined,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}
