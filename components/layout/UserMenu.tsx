"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";

interface UserMenuProps {
    session: any;
}

const UserMenu = ({ session }: UserMenuProps) => {
    if (!session?.user) {
        return (
            <div className="flex items-center border-l border-black/10 ml-[13px] pl-[13px] h-full">
                <Link
                    href="/login"
                    className="ml-4 px-4 py-2 bg-[#700A0A] text-white rounded text-sm hover:bg-[#550808] transition-colors"
                >
                    Log In
                </Link>
            </div>
        );
    }

    const isAdmin = session.user.role === "administrator";

    return (
        <div className="flex items-center border-l border-black/10 ml-[13px] pl-[13px] h-full">
            <li className="flex h-full items-center list-none">
                <Link
                    href="/profile"
                    className="flex items-center gap-[12px] px-[11px] h-full text-[#666] hover:text-primary transition-all duration-200"
                >
                    <div className="flex flex-col items-start justify-center">
                        <span className={`text-[11px] font-bold leading-none mb-[3px] uppercase tracking-[0.5px] ${isAdmin ? 'text-[#8B1538]' : 'text-primary'}`}>
                            {isAdmin ? 'ADMIN' : (session.user.student_number || "ALUMNI")}
                        </span>
                        <span className="text-[14px] font-semibold text-[#333] leading-none flex items-center gap-[4px]">
                            {session.user.name?.split(' ')[0] || "User"} <i className="fas fa-caret-down text-[10px]"></i>
                        </span>
                    </div>
                </Link>
            </li>
            <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="pl-[11px] text-[#666] text-[19px] flex items-center hover:text-secondary transition-all duration-200 group"
            >
                <i className="fas fa-sign-out-alt group-hover:scale-110"></i>
            </button>
        </div>
    );
};

export default UserMenu;
