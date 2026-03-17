"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import AlumniCard from "@/components/ui/AlumniCard";
import PageHeader from "@/components/layout/PageHeader";
import SearchFilter from "@/components/ui/SearchFilter";

export default function NetworkPage() {
  const { data: session } = useSession();
  const [alumni, setAlumni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/alumni");
      const data = await res.json();
      if (!data.error) {
        setAlumni(data);
      }
    } catch (error) {
      console.error("Failed to fetch alumni:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAlumni = alumni.filter((a) => {
    const matchesSearch =
      a.first_name.toLowerCase().includes(search.toLowerCase()) ||
      a.last_name.toLowerCase().includes(search.toLowerCase()) ||
      a.degree.toLowerCase().includes(search.toLowerCase());

    if (filter === "all") return matchesSearch;
    return matchesSearch && a.connectionStatus === filter;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BE123C]"></div>
      </div>
    );
  }

  const filterOptions = [
    { id: "all", label: "All" },
    { id: "connectable", label: "Discover" },
    { id: "pending", label: "Pending" },
    { id: "accepted", label: "Linked" },
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen antialiased font-jakarta pb-20">
      <PageHeader
        title="Alumni"
        subtitle="Network"
        description="AConnect Community Hub"
        count={filteredAlumni.length}
        countSuffix="Alumni"
        icon={
          <svg
            className="w-6 h-6 text-amber-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        }
      />

      <main className="max-w-6xl mx-auto px-6 pt-4 pb-12">
        <SearchFilter
          search={search}
          onSearchChange={setSearch}
          filter={filter}
          onFilterChange={setFilter}
          filterOptions={filterOptions}
          placeholder="Search by name, degree, or skills..."
        />

        {filteredAlumni.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAlumni.map((alumnus) => (
              <AlumniCard
                key={alumnus.id}
                alumnus={alumnus}
                onAction={fetchAlumni}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
            <h3 className="text-lg font-bold text-slate-900">
              No matching alumni found
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Try adjusting your filters or search terms.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
