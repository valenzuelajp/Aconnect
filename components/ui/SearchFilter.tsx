"use client";

import React from "react";

interface FilterOption {
  id: string;
  label: string;
}

interface SearchFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  filter: string;
  onFilterChange: (value: string) => void;
  filterOptions: FilterOption[];
  placeholder?: string;
}

const SearchFilter = ({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  filterOptions,
  placeholder = "Search...",
}: SearchFilterProps) => {
  return (
    <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 mb-12 flex flex-col md:flex-row gap-2">
      <div className="flex-grow flex items-center px-4 gap-3 border-r border-slate-100">
        <svg
          className="w-5 h-5 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full py-3 bg-transparent outline-none text-sm font-medium"
        />
      </div>
      <div className="flex gap-2 p-1">
        {filterOptions.map((f) => (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className={`text-xs font-bold px-4 py-2 rounded-xl transition ${
              filter === f.id
                ? "bg-[#8B1538] text-white shadow-md shadow-rose-100"
                : "bg-slate-50 text-slate-600 hover:bg-slate-100"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;
