"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { PanelLeftClose, Plus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BrandMark } from "@/components/brand-mark";
import { NAV_ITEMS, CAPTURE_ITEM, type NavItem } from "./nav-config";
import { AccountMenu } from "./account-menu";

function isActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface AppSidebarProps {
  account: { email: string; name: string | null };
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}

export function AppSidebar({
  account,
  collapsed = false,
  onToggleCollapsed,
}: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <TooltipProvider delay={200}>
      <nav
        className={cn(
          "flex h-full flex-col py-4 transition-[padding] duration-200 ease-out",
          collapsed ? "px-2" : "px-3"
        )}
        aria-label="Primary"
      >
        <div
          className={cn(
            "group/head flex items-center pb-6",
            collapsed ? "justify-center" : "justify-between px-1"
          )}
        >
          {collapsed ? (
            onToggleCollapsed && (
              <button
                type="button"
                onClick={onToggleCollapsed}
                aria-label="Expand sidebar"
                className={cn(
                  "group/logo relative grid size-8 place-items-center overflow-hidden rounded-lg outline-none",
                  "transition-all duration-200 ease-out",
                  "hover:scale-105 hover:bg-primary/5",
                  "active:scale-95",
                  "focus-visible:ring-2 focus-visible:ring-ring/40"
                )}
              >
                <Image
                  src="/icon.svg"
                  alt=""
                  width={32}
                  height={32}
                  className="size-8 rounded-xl shadow-sm transition-transform duration-200 group-hover/logo:scale-110"
                />
              </button>
            )
          ) : (
            <>
              <BrandMark />
              {onToggleCollapsed && (
                <ToggleButton collapsed={false} onClick={onToggleCollapsed} />
              )}
            </>
          )}
        </div>

        <Tooltip disabled={!collapsed}>
          <TooltipTrigger
            render={
              <Button
                render={<Link href={CAPTURE_ITEM.href} />}
                size={collapsed ? "icon" : "lg"}
                className={cn(
                  "mb-6",
                  collapsed ? "w-full" : "w-full justify-start gap-2"
                )}
                aria-label="Capture"
              >
                <Plus className="size-4" />
                {!collapsed && "Capture"}
              </Button>
            }
          />
          <TooltipContent side="right">Capture</TooltipContent>
        </Tooltip>

        <div className="flex flex-col gap-0.5">
          {NAV_ITEMS.map((item) => (
            <SidebarNavLink
              key={item.href}
              item={item}
              active={isActive(pathname, item.href)}
              collapsed={collapsed}
            />
          ))}
        </div>

        <div className="mt-auto pt-4">
          {collapsed ? (
            <div className="flex justify-center">
              <AccountMenu email={account.email} name={account.name} />
            </div>
          ) : (
            <AccountMenu
              email={account.email}
              name={account.name}
              variant="sidebar"
            />
          )}
        </div>
      </nav>
    </TooltipProvider>
  );
}

function SidebarNavLink({
  item,
  active,
  collapsed,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
}) {
  const Icon = item.icon;
  return (
    <Tooltip disabled={!collapsed}>
      <TooltipTrigger
        render={
          <Link
            href={item.href}
            aria-current={active ? "page" : undefined}
            aria-label={item.label}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
              "focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:outline-none",
              collapsed && "justify-center px-0",
              active
                ? "bg-muted font-medium text-foreground"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <Icon className="size-[18px] shrink-0" />
            {!collapsed && item.label}
          </Link>
        }
      />
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

function ToggleButton({
  collapsed,
  onClick,
}: {
  collapsed: boolean;
  onClick: () => void;
}) {
  const Icon: LucideIcon = PanelLeftClose;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Collapse sidebar"
      aria-expanded={!collapsed}
      className={cn(
        "group/toggle relative grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg outline-none",
        "transition-all duration-200 ease-out",
        "hover:bg-primary/5 hover:text-primary",
        "active:scale-95",
        "focus-visible:ring-2 focus-visible:ring-ring/40",
        "text-muted-foreground"
      )}
    >
      <span
        className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/0 to-primary/0 transition-all duration-200 group-hover/toggle:from-primary/5 group-hover/toggle:to-primary/10"
        aria-hidden
      />
      <Icon className="relative size-4 transition-transform duration-200 group-hover/toggle:scale-110" />
    </button>
  );
}
