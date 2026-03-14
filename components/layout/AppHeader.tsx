"use client";

import { useSession } from "next-auth/react";
import Logo from "./Logo";
import GlobalNav from "./GlobalNav";
import UserMenu from "./UserMenu";

const AppHeader = () => {
  const { data: session } = useSession();
  const isAdmin = (session?.user as any)?.role === "administrator";

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: "fa-chart-line" },
    { label: "Home", href: "/", icon: "fa-house-user" },
    { label: "Network", href: "/alumni", icon: "fa-user-friends" },
    { label: "Jobs", href: "/jobs", icon: "fa-briefcase" },
    { label: "Messaging", href: "/chat", icon: "fa-comment-dots" },
  ];

  return (
    <header className="sticky top-0 w-full z-[2000] bg-white border-b border-black/10 h-[55px]">
      <div className="max-w-[1185px] mx-auto w-full flex items-center px-[25px] h-full">
        <Logo href={isAdmin ? "/dashboard" : "/"} />
        <GlobalNav isAdmin={isAdmin} navItems={navItems} />
        <UserMenu session={session} />
      </div>
    </header>
  );
};

export default AppHeader;
