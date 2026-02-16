"use client";

import React from "react";

interface PageHeaderProps {
    title: string;
    subtitle: string;
    description: string;
    icon: React.ReactNode;
    count?: number;
    countSuffix?: string;
}

const PageHeader = ({ title, subtitle, description, icon, count, countSuffix }: PageHeaderProps) => {
    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 mb-8">
            <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#8B1538] rounded-xl flex items-center justify-center shadow-lg shadow-rose-200">
                        {icon}
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-slate-900">
                            {title} <span className="text-[#8B1538]">{subtitle}</span>
                        </h1>
                        <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">{description}</p>
                    </div>
                </div>
                {count !== undefined && (
                    <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-200">
                        {count} {countSuffix}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default PageHeader;
