"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, FileVideo } from "lucide-react";

// Official Terabox Logo Icon
function TeraboxLogo({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            className={className}
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Folder body */}
            <path
                d="M6 16C6 13.7909 7.79086 12 10 12H18L22 16H38C40.2091 16 42 17.7909 42 20V36C42 38.2091 40.2091 40 38 40H10C7.79086 40 6 38.2091 6 36V16Z"
                fill="url(#terabox-gradient)"
            />
            {/* Cloud symbol */}
            <path
                d="M30 24C30 21.7909 28.2091 20 26 20C24.9391 20 23.9217 20.4214 23.1716 21.1716C22.4214 21.9217 22 22.9391 22 24C20.6739 24 19.4021 24.5268 18.4645 25.4645C17.5268 26.4021 17 27.6739 17 29C17 31.2091 18.7909 33 21 33H31C33.2091 33 35 31.2091 35 29C35 26.7909 33.2091 25 31 25C30.4477 25 30 24.5523 30 24Z"
                fill="white"
                fillOpacity="0.9"
            />
            <defs>
                <linearGradient id="terabox-gradient" x1="6" y1="12" x2="42" y2="40" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#22D3EE" />
                    <stop offset="1" stopColor="#10B981" />
                </linearGradient>
            </defs>
        </svg>
    );
}

// Thumbnail component with error handling
function FileThumbnail({ src, alt }: { src: string; alt: string }) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    if (hasError || !src) {
        return (
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <FileVideo className="h-12 w-12 text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="relative aspect-video bg-muted overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            <img
                src={src}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setHasError(true);
                    setIsLoading(false);
                }}
                referrerPolicy="no-referrer"
            />
        </div>
    );
}

interface TeraboxFile {
    filename: string;
    size: number;
    size_format: string;
    thumbnail: string;
    download: string;
    direct_link: string;
}

interface TeraboxResultCardProps {
    files: TeraboxFile[];
    total: number;
}

export function TeraboxResultCard({ files, total }: TeraboxResultCardProps) {
    const handleDownload = (url: string) => {
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Header */}
            <div className="rounded-t-xl border border-b-0 bg-card p-4 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400/20 to-emerald-500/20 flex items-center justify-center p-1">
                        <TeraboxLogo className="w-10 h-10" />
                    </div>
                    <div className="flex-1">
                        <span className="font-semibold text-foreground">Terabox Download</span>
                        <p className="text-sm text-muted-foreground">
                            {total} file{total > 1 ? "s" : ""} available
                        </p>
                    </div>
                </div>
            </div>

            {/* Files Grid */}
            <div className="border rounded-b-xl bg-card p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {files.map((file, index) => (
                        <div
                            key={index}
                            className="rounded-lg border bg-background/50 overflow-hidden hover:border-emerald-500/50 transition-colors"
                        >
                            {/* Thumbnail */}
                            <FileThumbnail src={file.thumbnail} alt={file.filename} />

                            {/* File Info */}
                            <div className="p-3 space-y-2">
                                <p className="text-sm font-medium truncate" title={file.filename}>
                                    {file.filename}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {file.size_format}
                                </p>
                                <Button
                                    onClick={() => handleDownload(file.download)}
                                    size="sm"
                                    className="w-full gap-2 bg-gradient-to-r from-cyan-400 to-emerald-600 hover:from-cyan-500 hover:to-emerald-700"
                                >
                                    <Download className="h-4 w-4" />
                                    Download
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
