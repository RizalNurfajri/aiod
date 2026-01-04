"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Download, Youtube, Loader2, Music, Film } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface AudioFormat {
    format_id: string;
    ext: string;
    note: string;
    filesize: number;
    acodec: string;
}

interface VideoFormat {
    format_id: string;
    ext: string;
    note: string;
    resolution: string;
    filesize: number;
    vcodec: string;
}

interface VideoInfo {
    title: string;
    uploader: string;
    thumbnail: string;
    duration: number;
    audio_formats: AudioFormat[];
    video_formats: VideoFormat[];
}

interface YoutubeResultCardProps {
    videoUrl: string;
}

function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatFileSize(bytes: number): string {
    if (!bytes || bytes === 0) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
}

export function YoutubeResultCard({ videoUrl }: YoutubeResultCardProps) {
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState<string | null>(null);
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchInfo = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch("/api/youtube", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url: videoUrl, action: "info" }),
                });

                const data = await response.json();


                if (!response.ok || !data.success) {
                    throw new Error(data.error || "Failed to get video info");
                }

                setVideoInfo(data.data);
            } catch (err) {

                setError(err instanceof Error ? err.message : "Failed to get video info");
            } finally {
                setLoading(false);
            }
        };

        fetchInfo();
    }, [videoUrl]);

    const handleDownload = async (formatId: string, type: 'video' | 'audio') => {
        setDownloading(formatId);

        try {
            const response = await fetch("/api/youtube", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    url: videoUrl,
                    action: "download",
                    format_id: formatId,
                    type,
                }),
            });

            const data = await response.json();


            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to get download link");
            }

            const downloadUrl = data.data?.download_url;

            if (!downloadUrl) {
                throw new Error("No download URL in response");
            }

            // Use proxy for direct download with proper filename
            const title = videoInfo?.title || "youtube_download";
            const ext = type === 'audio' ? 'm4a' : 'mp4';
            const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_').substring(0, 100);
            const filename = `${cleanTitle}.${ext}`;

            const proxyUrl = `/api/proxy?url=${encodeURIComponent(downloadUrl)}&filename=${encodeURIComponent(filename)}`;

            // Use hidden anchor for download
            const link = document.createElement('a');
            link.href = proxyUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast({
                title: "Download Started",
                description: `Downloading ${title}...`,
            });
        } catch (err) {

            toast({
                variant: "destructive",
                title: "Download Failed",
                description: err instanceof Error ? err.message : "Failed to download",
            });
        } finally {
            setDownloading(null);
        }
    };

    if (loading) {
        return (
            <div className="w-full max-w-2xl mx-auto space-y-4">
                <Skeleton className="aspect-video w-full rounded-xl" />
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full max-w-2xl mx-auto">
                <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 text-center">
                    <h3 className="font-semibold text-destructive mb-2">Error</h3>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </div>
            </div>
        );
    }

    // Get clean resolution label from format
    const getResolutionLabel = (format: VideoFormat): string => {
        if (format.note && format.note.includes('p')) {
            return format.note;
        }
        // Extract height from resolution (e.g., "640x360" -> "360p")
        const match = format.resolution.match(/x(\d+)$/);
        if (match) {
            return `${match[1]}p`;
        }
        return format.resolution;
    };

    // Filter and dedupe video formats to show main resolutions
    const resolutionOrder = ['1080', '720', '480', '360'];
    const seenResolutions = new Set<string>();
    const mainVideoFormats = videoInfo?.video_formats
        .filter(f => {
            const label = getResolutionLabel(f);
            const height = label.replace('p', '');
            if (resolutionOrder.includes(height) && !seenResolutions.has(height)) {
                seenResolutions.add(height);
                return true;
            }
            return false;
        })
        .sort((a, b) => {
            const aHeight = parseInt(getResolutionLabel(a).replace('p', ''));
            const bHeight = parseInt(getResolutionLabel(b).replace('p', ''));
            return bHeight - aHeight; // Sort highest first
        }) || [];

    // Get best audio format (medium quality m4a)
    const bestAudioFormat = videoInfo?.audio_formats.find(f =>
        f.note === 'medium' && f.ext === 'm4a'
    ) || videoInfo?.audio_formats[0];

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="rounded-xl border bg-card overflow-hidden shadow-lg">
                {/* Header */}
                <div className="p-4 border-b bg-gradient-to-r from-red-500/10 to-red-700/10">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center flex-shrink-0">
                            <Youtube className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-foreground line-clamp-2">
                                {videoInfo?.title || "YouTube Video"}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                                {videoInfo?.uploader}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Thumbnail */}
                {videoInfo?.thumbnail && (
                    <div className="relative aspect-video bg-muted overflow-hidden">
                        <img
                            src={videoInfo.thumbnail}
                            alt={videoInfo.title || "Video thumbnail"}
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                        />
                        {videoInfo.duration > 0 && (
                            <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 rounded text-xs text-white font-medium">
                                {formatDuration(videoInfo.duration)}
                            </div>
                        )}
                    </div>
                )}

                {/* Video Download Options */}
                {mainVideoFormats.length > 0 && (
                    <div className="p-4 space-y-3 border-b">
                        <div className="flex items-center gap-2">
                            <Film className="h-4 w-4 text-red-500" />
                            <h4 className="text-sm font-medium">Video (MP4)</h4>
                        </div>
                        <div className="grid gap-2">
                            {mainVideoFormats.map((format) => (
                                <Button
                                    key={format.format_id}
                                    onClick={() => handleDownload(format.format_id, 'video')}
                                    disabled={downloading !== null}
                                    variant="outline"
                                    className="w-full h-11 gap-3 justify-between hover:bg-red-500/10 hover:border-red-500/50"
                                >
                                    <div className="flex items-center gap-3">
                                        {downloading === format.format_id ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-red-500" />
                                        ) : (
                                            <Download className="h-4 w-4 text-red-500" />
                                        )}
                                        <span className="font-medium">
                                            {getResolutionLabel(format)}
                                        </span>
                                        {format.filesize > 0 && (
                                            <span className="text-muted-foreground text-sm">
                                                ({formatFileSize(format.filesize)})
                                            </span>
                                        )}
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Audio Download Option */}
                {bestAudioFormat && (
                    <div className="p-4 space-y-3">
                        <div className="flex items-center gap-2">
                            <Music className="h-4 w-4 text-green-500" />
                            <h4 className="text-sm font-medium">Audio (MP3)</h4>
                        </div>
                        <Button
                            onClick={() => handleDownload(bestAudioFormat.format_id, 'audio')}
                            disabled={downloading !== null}
                            variant="outline"
                            className="w-full h-11 gap-3 justify-start hover:bg-green-500/10 hover:border-green-500/50"
                        >
                            {downloading === bestAudioFormat.format_id ? (
                                <Loader2 className="h-4 w-4 animate-spin text-green-500" />
                            ) : (
                                <Download className="h-4 w-4 text-green-500" />
                            )}
                            <span className="font-medium">MP3</span>
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
