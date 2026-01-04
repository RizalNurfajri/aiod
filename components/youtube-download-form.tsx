"use client";

import { useState } from "react";
import { Loader2, ArrowRight, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

function isValidYoutubeUrl(url: string): boolean {
    const patterns = [
        /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/i,
        /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/i,
        /^https?:\/\/youtu\.be\/[\w-]+/i,
        /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/i,
    ];
    return patterns.some((pattern) => pattern.test(url));
}

export function YoutubeDownloadForm() {
    const [url, setUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const router = useRouter();

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setUrl(text);
        } catch {
            toast({
                variant: "destructive",
                title: "Paste Failed",
                description: "Could not access clipboard. Please paste manually.",
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!url.trim()) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Please enter a YouTube URL",
            });
            return;
        }

        if (!isValidYoutubeUrl(url)) {
            toast({
                variant: "destructive",
                title: "Invalid URL",
                description: "Please enter a valid YouTube video URL",
            });
            return;
        }

        const encodedUrl = encodeURIComponent(url);
        router.push(`/youtube/result?url=${encodedUrl}`);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <Youtube className="h-5 w-5" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Paste YouTube video URL here..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={loading}
                        className="h-12 text-base pl-11 pr-12"
                    />
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={handlePaste}
                        disabled={loading}
                        className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10"
                        title="Paste from clipboard"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                        </svg>
                    </Button>
                </div>
                <Button
                    type="submit"
                    disabled={loading}
                    className="h-12 px-6 font-semibold bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 border-0"
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <ArrowRight className="h-5 w-5" />
                    )}
                </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
                Paste any YouTube video URL to download in HD
            </p>
        </form>
    );
}
