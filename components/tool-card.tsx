"use client";

import Link from "next/link";

interface ToolCardProps {
    title: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    iconBgColor: string;
    iconColor: string;
}

export function ToolCard({
    title,
    description,
    href,
    icon: Icon,
    iconBgColor,
    iconColor,
}: ToolCardProps) {
    return (
        <Link href={href} className="group block">
            <div className="relative p-6 rounded-2xl border bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-1">
                {/* Icon Container */}
                <div
                    className={`w-14 h-14 rounded-xl flex items-center justify-center mb-4 ${iconBgColor}`}
                >
                    <Icon className={`w-7 h-7 ${iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>

                {/* Hover Indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg
                        className="w-5 h-5 text-muted-foreground"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </div>
            </div>
        </Link>
    );
}
