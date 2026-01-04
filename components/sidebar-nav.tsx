"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Download, Instagram, Facebook, Youtube, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

// Custom TikTok Icon
function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
    );
}

// Custom Terabox Icon
function TeraboxIcon({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            <path d="M4 4h16v4h-2V6H6v2H4V4z" />
            <path d="M5 8l2 12h10l2-12H5zm6 2h2v8h-2v-8z" />
        </svg>
    );
}

const menuItems = [
    {
        name: "TikTok",
        href: "/tiktok",
        icon: TikTokIcon,
        color: "text-pink-500",
        bgHover: "hover:bg-pink-500/10",
    },
    {
        name: "Instagram",
        href: "/instagram",
        icon: Instagram,
        color: "text-purple-500",
        bgHover: "hover:bg-purple-500/10",
    },
    {
        name: "Facebook",
        href: "/facebook",
        icon: Facebook,
        color: "text-blue-500",
        bgHover: "hover:bg-blue-500/10",
    },
    {
        name: "YouTube",
        href: "/youtube",
        icon: Youtube,
        color: "text-red-500",
        bgHover: "hover:bg-red-500/10",
    },
    {
        name: "Terabox",
        href: "/terabox",
        icon: TeraboxIcon,
        color: "text-green-500",
        bgHover: "hover:bg-green-500/10",
    },
];

export function SidebarNav() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const pathname = usePathname();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Get current active item
    const activeItem = menuItems.find(item => item.href === pathname) || menuItems[0];
    const ActiveIcon = activeItem.icon;

    return (
        <div className="relative z-50" ref={menuRef}>
            {/* Trigger Button */}
            <Button
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 h-10 px-3"
            >
                <Menu className="h-4 w-4" />
                <div className="hidden sm:flex items-center gap-2">
                    <ActiveIcon className={`h-4 w-4 ${activeItem.color}`} />
                    <span className="text-sm font-medium">{activeItem.name}</span>
                </div>
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
                    {/* Header */}
                    <div className="flex items-center gap-2 px-2 py-2 mb-1">
                        <Download className="h-4 w-4 text-primary" />
                        <span className="text-sm font-semibold">Downloaders</span>
                    </div>

                    <div className="h-px bg-border mb-1" />

                    {/* Menu Items */}
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-2 py-2 rounded-md text-sm transition-colors ${item.bgHover} ${isActive
                                    ? "bg-accent text-accent-foreground font-medium"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <Icon className={`h-4 w-4 ${item.color}`} />
                                <span>{item.name}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                                )}
                            </Link>
                        );
                    })}

                    <div className="h-px bg-border mt-1 mb-1" />

                    {/* Footer */}
                    <div className="px-2 py-1.5">
                        <p className="text-xs text-muted-foreground text-center">
                            Fast & Free Downloads
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
