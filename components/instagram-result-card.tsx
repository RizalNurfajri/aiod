"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Instagram, Image as ImageIcon } from "lucide-react";

interface MediaItem {
    ext: string;
    name: string;
    type: string;
    url: string;
    thumbnail?: string;
}

interface InstagramResultCardProps {
    data: MediaItem[];
    title?: string;
}

// Thumbnail component with error handling
function MediaThumbnail({ item }: { item: MediaItem }) {
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const thumbnailUrl = item.thumbnail;

    if (hasError || !thumbnailUrl) {
        return (
            <div className="aspect-video bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-orange-900/50 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="relative aspect-video bg-muted overflow-hidden">
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <div className="w-8 h-8 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
            <img
                src={thumbnailUrl}
                alt={item.name}
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

export function InstagramResultCard({ data, title }: InstagramResultCardProps) {
    const handleDownload = (item: MediaItem) => {
        // The URL from gimita.id (media.igram.world) already handles download
        // Just open it directly - it has proper headers for download
        const a = document.createElement("a");
        a.href = item.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            <div className="rounded-xl border bg-card overflow-hidden shadow-lg">
                {/* Header */}
                <div className="p-4 border-b bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-orange-500/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
                            <Instagram className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="font-semibold text-foreground">Instagram Download</span>
                            {title && (
                                <p className="text-sm text-muted-foreground truncate" title={title}>
                                    {title}
                                </p>
                            )}
                            {!title && (
                                <p className="text-sm text-muted-foreground">
                                    {data.length} file{data.length > 1 ? "s" : ""} available
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Media Grid */}
                <div className="p-4">
                    <div className={`grid gap-4 ${data.length === 1 ? 'grid-cols-1 max-w-md mx-auto' : 'grid-cols-1 md:grid-cols-2'}`}>
                        {data.map((item, index) => (
                            <div
                                key={index}
                                className="rounded-lg border bg-background/50 overflow-hidden hover:border-pink-500/50 transition-colors"
                            >
                                {/* Thumbnail */}
                                <MediaThumbnail item={item} />

                                {/* File Info & Download */}
                                <div className="p-3 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium truncate flex-1" title={item.name}>
                                            {item.name}
                                        </p>
                                        <span className="text-xs text-muted-foreground ml-2 px-2 py-0.5 bg-muted rounded">
                                            {item.ext.toUpperCase()}
                                        </span>
                                    </div>
                                    <Button
                                        onClick={() => handleDownload(item)}
                                        size="sm"
                                        className="w-full gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 hover:from-purple-600 hover:via-pink-600 hover:to-orange-600"
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
        </div>
    );
}

