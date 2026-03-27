"use client";

import { memo, useEffect, useState } from "react";

interface DropdownProps {
  value: string;
  onChange: (value: string) => void; // save changes to Liveblocks
  options: string[];
  className?: string;
}

const Dropdown = memo(
  ({ value, onChange, options, className }: DropdownProps) => {
    const [selectedVal, setSelectedVal] = useState(value);

    // Set new value as user selects them (instant UI updates)
    useEffect(() => {
      setSelectedVal(value);
    }, [value, setSelectedVal]);

    const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      const newValue = event.target.value;
      setSelectedVal(newValue);
      onChange(newValue);
    };

    return (
      <div className={`relative ${className ?? ""}`}>
        <select
          value={selectedVal}
          onChange={handleChange}
          className="w-full rounded-lg border-2 border-[#f5f5f5] bg-[#f5f5f5] px-2 py-1 text-xs transition-colors duration-200 outline-none hover:border-[#e8e8e8] focus:border-blue-600"
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  },
);

Dropdown.displayName = "Dropdown";

export default Dropdown;
