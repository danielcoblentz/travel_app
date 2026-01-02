"use client";
import React, { useState } from "react";
import SearchBar from "./SearchBar";
import List from "./List";

type Trip = { id: string | number; text: string };

type Props = {
  trips: Trip[];
  placeholder?: string;
};

export default function TripsSearch({ trips, placeholder = "Search" }: Props) {
  const [query, setQuery] = useState<string>("");

  // filtered results — used for dropdown or results list
  const filtered = trips.filter((t) =>
    t.text.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <section style={{ padding: "20px 0" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <SearchBar value={query} onChange={setQuery} placeholder={placeholder} />
          <div style={{ marginTop: 12 }}>
            <List items={filtered} label="Matching trips" />
          </div>
        </div>
      </div>
    </section>
  );
}
