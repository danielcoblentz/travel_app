"use client";
import React from "react";

type Props = {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  label?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
  label = "",
}: Props) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      {label && (
        <label htmlFor="search-input" style={{ display: "block" }}>
          {label}
        </label>
      )}

      <input
        id="search-input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label || placeholder}
        style={{
          flex: 1,
          padding: "8px 12px",
          borderRadius: 4,
          border: "1px solid #ccc",
        }}
      />

      <button
        type="button"
        onClick={() => onChange("")}
        aria-label="Clear search"
        disabled={value === ""}
        style={{ padding: "8px 12px", borderRadius: 4 }}
      >
        Clear
      </button>
    </div>
  );
}
         