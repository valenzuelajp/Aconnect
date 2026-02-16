"use client";

import Link from "next/link";
import Image from "next/image";

interface LogoProps {
    href?: string;
}

const Logo = ({ href = "/" }: LogoProps) => {
    return (
        <div className="logo-area">
            <Link href={href}>
                <Image
                    src="/assets/images/small_logo.png"
                    alt="Logo"
                    width={52}
                    height={52}
                    className="h-[52px] w-auto"
                />
            </Link>
        </div>
    );
};

export default Logo;
