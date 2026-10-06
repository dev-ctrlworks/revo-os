"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useCollectionNames } from "@/lib/use-collection-meta";
import {
  Command,
  CommandEmpty,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export function CollectionPicker({
  value,
  onChange,
  id,
  placeholder = "Collection name",
}: {
  value: string;
  onChange: (next: string) => void;
  id?: string;
  placeholder?: string;
}) {
  const collections = useCollectionNames();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const options = Array.from(
    new Set([value, ...collections].filter(Boolean))
  ).sort((a, b) => a.localeCompare(b));
  const filtered = options.filter((c) =>
    c.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) setQuery("");
      }}
    >
      <PopoverTrigger
        nativeButton={false}
        render={
          <div className="relative">
            <Input
              id={id}
              role="combobox"
              aria-expanded={open}
              aria-haspopup="listbox"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                if (open) setQuery(e.target.value);
              }}
              placeholder={placeholder}
              className="pr-10"
            />
            <span className="pointer-events-none absolute inset-y-0 right-0 flex w-9 items-center justify-center text-muted-foreground">
              <ChevronDown className="size-4" />
            </span>
          </div>
        }
      />

      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-72 overflow-hidden p-1!"
      >
        <Command>
          <CommandList>
            {filtered.length === 0 && (
              <CommandEmpty>
                {query.trim()
                  ? `${value.trim() || query.trim()} — will be created`
                  : "No collections yet"}
              </CommandEmpty>
            )}
            {filtered.map((c) => (
              <CommandItem
                key={c}
                value={c}
                data-checked={c === value}
                onSelect={() => {
                  onChange(c);
                  setOpen(false);
                }}
              >
                <span className="min-w-0 flex-1 truncate">{c}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}