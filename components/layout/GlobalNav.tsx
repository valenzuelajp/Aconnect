"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  href: string;
  icon: string;
}

interface GlobalNavProps {
  isAdmin: boolean;
  navItems: NavItem[];
}

const GlobalNav = ({ isAdmin, navItems }: GlobalNavProps) => {
  const pathname = usePathname();

  if (isAdmin) {
    return (
      <nav className="ml-auto h-full">
        <ul className="flex h-full m-0 p-0 list-none">
          <li className="flex h-full items-center">
            <Link
              href="/dashboard"
              className={`flex flex-col items-center justify-center min-w-[84px] h-full text-[13px] transition-all duration-200 border-b-2 pt-[4px] ${
                pathname === "/dashboard"
                  ? "text-black border-black"
                  : "text-[#666] border-transparent hover:text-black"
              }`}
            >
              <i className="fas fa-chart-line text-[20px] mb-[4px]"></i>
              <span className="font-medium tracking-[0.3px] flex items-center gap-[4px]">
                Dashboard
              </span>
            </Link>
          </li>

          <li className="flex h-full items-center relative group">
            <div
              className={`flex flex-col items-center justify-center min-w-[84px] h-full text-[13px] transition-all duration-200 border-b-2 pt-[4px] cursor-pointer ${
                pathname.startsWith("/admin/alumni") ||
                pathname.startsWith("/admin/jobs") ||
                pathname.startsWith("/admin/events") ||
                pathname.startsWith("/admin/posting") ||
                pathname.startsWith("/admin/analytics")
                  ? "text-black border-black"
                  : "text-[#666] border-transparent hover:text-black"
              }`}
            >
              <i className="fas fa-tasks text-[20px] mb-[4px]"></i>
              <span className="font-medium tracking-[0.3px] flex items-center gap-[4px]">
                Management
                <i className="fas fa-caret-down text-[10px]"></i>
              </span>
            </div>
            <div className="absolute top-full left-0 mt-0 bg-white border border-black/10 rounded-b-lg shadow-lg min-w-[180px] py-2 hidden group-hover:block">
              <Link
                href="/admin/alumni"
                className="block px-4 py-2.5 text-[13px] text-[#333] hover:bg-[#f3f2ef] transition-colors"
              >
                Alumni List
              </Link>
              <Link
                href="/admin/jobs"
                className="block px-4 py-2.5 text-[13px] text-[#333] hover:bg-[#f3f2ef] transition-colors"
              >
                Job Posting
              </Link>
              <Link
                href="/admin/events"
                className="block px-4 py-2.5 text-[13px] text-[#333] hover:bg-[#f3f2ef] transition-colors"
              >
                Events
              </Link>
              <Link
                href="/admin/posting"
                className="block px-4 py-2.5 text-[13px] text-[#333] hover:bg-[#f3f2ef] transition-colors"
              >
                Posting
              </Link>
            </div>
          </li>

          <li className="flex h-full items-center relative group">
            <div
              className={`flex flex-col items-center justify-center min-w-[84px] h-full text-[13px] transition-all duration-200 border-b-2 pt-[4px] cursor-pointer ${
                pathname.startsWith("/admin/users") ||
                pathname.startsWith("/admin/logs")
                  ? "text-black border-black"
                  : "text-[#666] border-transparent hover:text-black"
              }`}
            >
              <i className="fas fa-cogs text-[20px] mb-[4px]"></i>
              <span className="font-medium tracking-[0.3px] flex items-center gap-[4px]">
                System
                <i className="fas fa-caret-down text-[10px]"></i>
              </span>
            </div>
            <div className="absolute top-full left-0 mt-0 bg-white border border-black/10 rounded-b-lg shadow-lg min-w-[180px] py-2 hidden group-hover:block">
              <Link
                href="/admin/logs"
                className="block px-4 py-2.5 text-[13px] text-[#333] hover:bg-[#f3f2ef] transition-colors"
              >
                Activity Log
              </Link>
            </div>
          </li>

          <li className="flex h-full items-center">
            <Link
              href="/admin/support"
              className={`flex flex-col items-center justify-center min-w-[84px] h-full text-[13px] transition-all duration-200 border-b-2 pt-[4px] ${
                pathname === "/admin/support"
                  ? "text-black border-black"
                  : "text-[#666] border-transparent hover:text-black"
              }`}
            >
              <i className="fas fa-headset text-[20px] mb-[4px]"></i>
              <span className="font-medium tracking-[0.3px] flex items-center gap-[4px]">
                Support
              </span>
            </Link>
          </li>

          <li className="flex h-full items-center">
            <Link
              href="/admin/analytics"
              className={`flex flex-col items-center justify-center min-w-[84px] h-full text-[13px] transition-all duration-200 border-b-2 pt-[4px] ${
                pathname === "/admin/analytics"
                  ? "text-black border-black"
                  : "text-[#666] border-transparent hover:text-black"
              }`}
            >
              <i className="fas fa-chart-bar text-[20px] mb-[4px]"></i>
              <span className="font-medium tracking-[0.3px] flex items-center gap-[4px]">
                Analytics
              </span>
            </Link>
          </li>
        </ul>
      </nav>
    );
  }

  return (
    <nav className="ml-auto h-full">
      <ul className="flex h-full m-0 p-0 list-none">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href} className="flex h-full items-center">
              <Link
                href={item.href}
                className={`flex flex-col items-center justify-center min-w-[84px] h-full text-[13px] transition-all duration-200 border-b-2 pt-[4px] ${
                  isActive
                    ? "text-black border-black"
                    : "text-[#666] border-transparent hover:text-black"
                }`}
              >
                <i className={`fas ${item.icon} text-[20px] mb-[4px]`}></i>
                <span className="font-medium tracking-[0.3px] flex items-center gap-[4px]">
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default GlobalNav;
