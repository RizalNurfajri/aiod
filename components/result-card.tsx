"use client";

import { Download, Music, Heart, Share2, Bookmark, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlowCard } from "@/components/glow-card";
import { useState } from "react";
import Image from "next/image";

interface ResultCardProps {
    data: {
        title: string;
        author: string;
        thumbnail: string;
        downloadUrl: string;
        audioUrl: string;
        stats?: {
            likes?: string;
            shares?: string;
            saves?: string;
            views?: string;
        };
    };
}

export function ResultCard({ data }: ResultCardProps) {
    const [downloading, setDownloading] = useState<string | null>(null);

    const handleDownload = (url: string, filename: string, type: 'video' | 'audio') => {
        setDownloading(type);

        try {
            // Use proxy API for direct download
            const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`;

            // Create invisible link and trigger download
            const link = document.createElement('a');
            link.href = proxyUrl;
            link.download = filename;
            link.style.display = 'none';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);


        } catch (error) {

        } finally {
            // Reset state after 2 seconds
            setTimeout(() => setDownloading(null), 2000);
        }
    };

    const formatNumber = (num: string | undefined): string => {
        if (!num) return "0";
        const n = parseInt(num);
        if (isNaN(n)) return num;
        if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
        if (n >= 1000) return (n / 1000).toFixed(1) + "K";
        return n.toString();
    };

    // Clean filename
    const cleanFilename = (title: string, ext: string) => {
        const cleanTitle = title
            .slice(0, 50)
            .replace(/[^a-zA-Z0-9\s-]/g, '')
            .replace(/\s+/g, '_')
            .toLowerCase();
        return `@TiksTod-${cleanTitle}${ext}`;
    };

    return (
        <GlowCard className="w-full max-w-2xl mx-auto animate-fade-in p-6">
            {/* Header */}
            <div className="mb-6">
                <h2 className="text-xl font-bold line-clamp-2 mb-2">{data.title}</h2>
                <p className="text-sm text-muted-foreground">By {data.author}</p>
            </div>

            {/* Content */}
            <div className="space-y-4">
                {/* Thumbnail */}
                {data.thumbnail && (
                    <div className="relative w-full max-w-md mx-auto aspect-video rounded-lg overflow-hidden bg-muted border">
                        <Image
                            src={data.thumbnail}
                            alt={data.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 672px"
                            onError={(e) => {
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                    parent.style.display = 'none';
                                }
                            }}
                        />
                    </div>
                )}

                {/* Statistics */}
                {data.stats && (data.stats.likes || data.stats.shares || data.stats.saves || data.stats.views) && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {data.stats.likes && (
                            <div className="flex items-center gap-2 p-3 rounded-md border bg-card">
                                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Likes</p>
                                    <p className="font-semibold text-sm truncate">{formatNumber(data.stats.likes)}</p>
                                </div>
                            </div>
                        )}
                        {data.stats.shares && (
                            <div className="flex items-center gap-2 p-3 rounded-md border bg-card">
                                <Share2 className="h-4 w-4 text-blue-500" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Shares</p>
                                    <p className="font-semibold text-sm truncate">{formatNumber(data.stats.shares)}</p>
                                </div>
                            </div>
                        )}
                        {data.stats.saves && (
                            <div className="flex items-center gap-2 p-3 rounded-md border bg-card">
                                <Bookmark className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Saves</p>
                                    <p className="font-semibold text-sm truncate">{formatNumber(data.stats.saves)}</p>
                                </div>
                            </div>
                        )}
                        {data.stats.views && (
                            <div className="flex items-center gap-2 p-3 rounded-md border bg-card">
                                <Eye className="h-4 w-4 text-green-500" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-muted-foreground">Views</p>
                                    <p className="font-semibold text-sm truncate">{formatNumber(data.stats.views)}</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Download Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                        onClick={() =>
                            handleDownload(
                                data.downloadUrl,
                                cleanFilename(data.title, '.mp4'),
                                'video'
                            )
                        }
                        disabled={downloading === 'video'}
                        className="flex-1 h-12 font-semibold"
                    >
                        {downloading === 'video' ? (
                            <>
                                <Download className="mr-2 h-5 w-5 animate-bounce" />
                                Downloading...
                            </>
                        ) : (
                            <>
                                <Download className="mr-2 h-5 w-5" />
                                Download Video No Watermark
                            </>
                        )}
                    </Button>
                    {data.audioUrl && (
                        <Button
                            onClick={() =>
                                handleDownload(
                                    data.audioUrl,
                                    cleanFilename(data.title, '.mp3'),
                                    'audio'
                                )
                            }
                            disabled={downloading === 'audio'}
                            variant="outline"
                            className="flex-1 h-12 font-semibold"
                        >
                            {downloading === 'audio' ? (
                                <>
                                    <Music className="mr-2 h-5 w-5 animate-bounce" />
                                    Downloading...
                                </>
                            ) : (
                                <>
                                    <Music className="mr-2 h-5 w-5" />
                                    Download Audio
                                </>
                            )}
                        </Button>
                    )}
                </div>
            </div>
        </GlowCard>
    );
}
