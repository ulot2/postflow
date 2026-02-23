"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { LogOut, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function CustomUserButton() {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex w-full items-center gap-3 outline-none hover:bg-white/[0.06] p-1 -m-1 rounded-lg transition-colors cursor-pointer">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.imageUrl} alt={user.fullName || ""} />
            <AvatarFallback className="bg-[#d4f24a] text-[#0f0f0f] text-xs font-bold">
              {user.firstName?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start truncate text-sm">
            <span className="font-medium text-white truncate w-full">
              {user.fullName || "User"}
            </span>
            <span className="text-[11px] text-white/40 truncate w-full flex text-left">
              {user.primaryEmailAddress?.emailAddress}
            </span>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="center" forceMount>
        <DropdownMenuLabel className="font-normal relative">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.fullName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => openUserProfile()}>
          <UserIcon className="mr-2 h-4 w-4" />
          <span>Manage account</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => signOut({ redirectUrl: "/sign-in" })}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
