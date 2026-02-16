"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import JobCard from "@/components/ui/JobCard";

export default function JobsPage() {
    const { data: session } = useSession();
    const [jobs, setJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [location, setLocation] = useState("");


    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            const query = new URLSearchParams({ search, location });
            const res = await fetch(`/api/jobs?${query}`);
            const data = await res.json();
            if (!data.error) {
                setJobs(data);
            }
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredJobs = jobs;

    return (
        <div className="bg-[#FAFAF8] min-h-screen font-sans pb-20">
            <div className="max-w-[1100px] mx-auto px-5 py-5">
                <div className="bg-white p-8 rounded-2xl shadow-md border border-[#E5E7EB] mb-8">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            fetchJobs();
                        }}
                        className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 mb-6"
                    >
                        <div className="relative flex items-center">
                            <i className="fas fa-search absolute left-4 text-[#6B7280]"></i>
                            <input
                                type="text"
                                placeholder="Job title or company..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-[#f9f9f9] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#8B1538] focus:ring-4 focus:ring-[#8B1538]/10 transition-all text-sm"
                            />
                        </div>
                        <div className="relative flex items-center">
                            <i className="fas fa-map-marker-alt absolute left-4 text-[#6B7280]"></i>
                            <input
                                type="text"
                                placeholder="City or Remote"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-[#f9f9f9] border border-[#E5E7EB] rounded-xl focus:outline-none focus:border-[#8B1538] focus:ring-4 focus:ring-[#8B1538]/10 transition-all text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-gradient-to-br from-[#8B1538] to-[#6B0F2A] text-white px-8 py-3 rounded-xl font-bold text-sm shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all"
                        >
                            <i className="fas fa-search mr-2"></i> Search
                        </button>
                    </form>


                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B1538]"></div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredJobs.length > 0 ? (
                            filteredJobs.map((job) => <JobCard key={job.id} job={job} />)
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#E5E7EB] text-[#6B7280]">
                                <i className="fas fa-briefcase text-4xl mb-4 opacity-20"></i>
                                <p>No Jobs Found</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
