"use client";

import { useState, useEffect } from "react";
import { LayoutList, LayoutGrid, ListMinus } from "lucide-react";
import { Button } from "@/components/ui/button";

type ViewMode = "list" | "grid" | "compact";

const VIEW_MODES: { value: ViewMode; label: string; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
  { value: "list", label: "List", icon: LayoutList, description: "Detailed rows with preview" },
  { value: "grid", label: "Grid", icon: LayoutGrid, description: "Cards with visual hierarchy" },
  { value: "compact", label: "Compact", icon: ListMinus, description: "Dense rows for scanning" },
];

interface ViewModeToggleProps {
  value?: ViewMode;
  onChange?: (mode: ViewMode) => void;
  storageKey?: string;
}

export function ViewModeToggle({ value: controlledValue, onChange, storageKey = "dashboard-view-mode" }: ViewModeToggleProps) {
  const [mode, setMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storageKey) as ViewMode) ?? "list";
    }
    return "list";
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(storageKey, mode);
  }, [mode, storageKey]);

  const handleChange = (newMode: ViewMode) => {
    setMode(newMode);
    onChange?.(newMode);
  };

  const isControlled = controlledValue !== undefined;
  const currentMode = isControlled ? controlledValue : mode;

  return (
    <div className="inline-flex items-center gap-1 rounded-xl border border-border/50 bg-card/55 p-1 backdrop-blur-xl" role="radiogroup" aria-label="View mode">
      {VIEW_MODES.map(({ value, label, icon: Icon, description }) => (
        <Button
          key={value}
          variant={currentMode === value ? "default" : "ghost"}
          size="icon"
          className="h-9 w-9 rounded-lg"
          onClick={() => handleChange(value)}
          role="radio"
          aria-checked={currentMode === value}
          aria-label={label}
          title={`${label} – ${description}`}
        >
          <Icon className="size-4" />
        </Button>
      ))}
    </div>
  );
}

export function useViewMode(storageKey = "dashboard-view-mode"): [ViewMode, (mode: ViewMode) => void] {
  const [mode, setMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem(storageKey) as ViewMode) ?? "list";
    }
    return "list";
  });

  const setViewMode = (newMode: ViewMode) => {
    setMode(newMode);
    localStorage.setItem(storageKey, newMode);
  };

  return [mode, setViewMode] as const;
}