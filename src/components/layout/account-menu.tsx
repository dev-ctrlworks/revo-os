"use client";

import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOutAction } from "@/features/auth/actions";

interface AccountMenuProps {
  email: string;
  name: string | null;
  /** "icon" (default) is the compact header trigger; "sidebar" is a full row. */
  variant?: "icon" | "sidebar";
}

function initials(name: string | null, email: string): string {
  const source = name?.trim() || email;
  const parts = source.split(/[\s@.]+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "?";
  const second = parts.length > 1 ? parts[1][0] : "";
  return (first + second).toUpperCase();
}

export function AccountMenu({
  email,
  name,
  variant = "icon",
}: AccountMenuProps) {
  const trigger =
    variant === "sidebar" ? (
      <button
        type="button"
        className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-muted"
        aria-label="Account menu"
      >
        <Avatar className="size-8">
          <AvatarFallback className="text-xs">
            {initials(name, email)}
          </AvatarFallback>
        </Avatar>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-foreground">
            {name || "Your account"}
          </span>
          <span className="block truncate text-xs text-muted-foreground">
            {email}
          </span>
        </span>
      </button>
    ) : (
      <Button
        variant="ghost"
        size="icon-sm"
        className="rounded-full"
        aria-label="Account menu"
      >
        <Avatar className="size-7">
          <AvatarFallback className="text-xs">
            {initials(name, email)}
          </AvatarFallback>
        </Avatar>
      </Button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={trigger} />
      <DropdownMenuContent
        align="start"
        side={variant === "sidebar" ? "top" : "bottom"}
        sideOffset={8}
        className="w-56"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel>
            <span className="block truncate text-sm font-medium text-foreground">
              {name || "Your account"}
            </span>
            <span className="block truncate text-xs font-normal text-muted-foreground">
              {email}
            </span>
          </DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href="/settings" />}>
          <Settings className="size-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem render={<Link href="/settings#profile" />}>
          <User className="size-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={signOutAction}>
          <DropdownMenuItem
            render={<button type="submit" className="w-full" />}
            variant="destructive"
          >
            <LogOut className="size-4" />
            Sign out
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
