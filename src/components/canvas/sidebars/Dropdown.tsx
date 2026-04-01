"use client";

import { memo, useEffect, useRef, useState } from "react";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

interface DropdownProps {
  value: string;
  onChange: (value: string) => void; // save changes to Liveblocks
  options: string[];
  className?: string;
}

const Dropdown = memo(
  ({ value, onChange, options, className }: DropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside of it
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, []);

    const handleSelect = (option: string) => {
      onChange(option);
      setIsOpen(false);
    };

    return (
      <div className={`relative ${className ?? ""}`} ref={dropdownRef}>
        {/* Trigger */}
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          className="border-input bg-muted text-foreground hover:border-border/80 focus-visible:border-ring focus-visible:ring-ring flex h-8 w-full items-center justify-between rounded-md border px-2.5 text-xs transition-colors duration-150 focus-visible:ring-1 focus-visible:outline-none"
        >
          <span className="truncate">{value}</span>
          {isOpen ? (
            <ChevronUp className="text-muted-foreground size-3.5 shrink-0" />
          ) : (
            <ChevronDown className="text-muted-foreground size-3.5 shrink-0" />
          )}
        </button>

        {/* Dropdown menu */}
        {isOpen && (
          <div className="bg-popover text-popover-foreground border-border absolute top-full left-0 z-50 mt-1 w-full overflow-hidden rounded-md border shadow-md">
            <ul
              role="listbox"
              className="no-scrollbar max-h-48 overflow-y-auto p-1"
            >
              {options.map((opt) => {
                const isSelected = value === opt;

                return (
                  <li
                    key={opt}
                    role="option"
                    onClick={() => handleSelect(opt)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSelect(opt);
                      }
                    }}
                    tabIndex={0}
                    aria-selected={isSelected}
                    className="hover:bg-accent hover:text-accent-foreground focus-within:bg-accent focus-within:text-accent-foreground relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pr-2 pl-7 text-xs transition-colors outline-none select-none"
                  >
                    <span className="absolute left-2 flex size-3.5 items-center justify-center">
                      {isSelected && <Check className="size-3.5" />}
                    </span>

                    <span className="truncate">{opt}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  },
);

Dropdown.displayName = "Dropdown";

export default Dropdown;
