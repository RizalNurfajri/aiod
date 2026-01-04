"use client";

import { useState } from "react";
import { ToolCard } from "@/components/tool-card";
import { Instagram, Facebook, Youtube } from "lucide-react";

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
            <path d="M19 11H5c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2zm0 8H5v-6h14v6z" />
            <path d="M12 3C9.5 3 7.5 5 7.5 7.5V11h2V7.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5V11h2V7.5C16.5 5 14.5 3 12 3z" />
            <circle cx="12" cy="16" r="1.5" />
        </svg>
    );
}

const categories = [
    { id: "all", label: "Semua" },
    { id: "video", label: "Video" },
    { id: "cloud", label: "Cloud Storage" },
];

const tools = [
    {
        id: "tiktok",
        title: "TikTok Downloader",
        description:
            "Download video TikTok tanpa watermark dengan kualitas terbaik. Cepat, mudah, dan gratis.",
        href: "/",
        icon: TikTokIcon,
        iconBgColor: "bg-pink-100 dark:bg-pink-500/20",
        iconColor: "text-pink-500",
        category: "video",
    },
    {
        id: "instagram",
        title: "Instagram Downloader",
        description:
            "Download video dan reels Instagram dengan kualitas HD. Simpan konten favorit Anda.",
        href: "/instagram",
        icon: Instagram,
        iconBgColor: "bg-purple-100 dark:bg-purple-500/20",
        iconColor: "text-purple-500",
        category: "video",
    },
    {
        id: "facebook",
        title: "Facebook Downloader",
        description:
            "Download video Facebook dengan mudah. Mendukung video publik dan pribadi.",
        href: "/facebook",
        icon: Facebook,
        iconBgColor: "bg-blue-100 dark:bg-blue-500/20",
        iconColor: "text-blue-500",
        category: "video",
    },
    {
        id: "youtube",
        title: "YouTube Downloader",
        description:
            "Download video dan audio YouTube dalam berbagai format. MP3, MP4, dan lainnya.",
        href: "/youtube",
        icon: Youtube,
        iconBgColor: "bg-red-100 dark:bg-red-500/20",
        iconColor: "text-red-500",
        category: "video",
    },
    {
        id: "terabox",
        title: "Terabox Downloader",
        description:
            "Download file dari Terabox tanpa login. Cepat, mudah, dan gratis.",
        href: "/terabox",
        icon: TeraboxIcon,
        iconBgColor: "bg-green-100 dark:bg-green-500/20",
        iconColor: "text-green-500",
        category: "cloud",
    },
];

export default function Home() {
    const [activeCategory, setActiveCategory] = useState("all");

    const filteredTools =
        activeCategory === "all"
            ? tools
            : tools.filter((tool) => tool.category === activeCategory);

    return (
        <main className="flex-1">
            {/* Hero Section */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-4xl mx-auto mb-12">
                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                            Semua alat yang Anda butuhkan untuk mengunduh video di satu tempat
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                            Setiap alat yang Anda butuhkan untuk mengunduh video dari berbagai
                            platform, di ujung jari. Semuanya 100% GRATIS dan mudah digunakan!
                        </p>
                    </div>

                    {/* Category Tabs */}
                    <div className="flex flex-wrap justify-center gap-2 mb-12">
                        {categories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${activeCategory === category.id
                                    ? "bg-foreground text-background shadow-md"
                                    : "bg-muted hover:bg-muted/80 text-foreground"
                                    }`}
                            >
                                {category.label}
                            </button>
                        ))}
                    </div>

                    {/* Tools Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
                        {filteredTools.map((tool) => (
                            <ToolCard
                                key={tool.id}
                                title={tool.title}
                                description={tool.description}
                                href={tool.href}
                                icon={tool.icon}
                                iconBgColor={tool.iconBgColor}
                                iconColor={tool.iconColor}
                            />
                        ))}
                    </div>

                    {/* Empty State */}
                    {filteredTools.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                Tidak ada alat dalam kategori ini.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}
