"use client";

import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { isValidTikTokUrl } from "@/lib/validator";
import { useRouter } from "next/navigation";

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

export function DownloadForm() {
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
                description: "Please enter a TikTok URL",
            });
            return;
        }

        if (!isValidTikTokUrl(url)) {
            toast({
                variant: "destructive",
                title: "Invalid URL",
                description: "Please enter a valid TikTok video URL",
            });
            return;
        }

        const encodedUrl = encodeURIComponent(url);
        router.push(`/result?url=${encodedUrl}`);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <TikTokIcon className="h-5 w-5" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Paste TikTok video URL here..."
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
                    className="h-12 px-6 font-semibold bg-gradient-to-r from-pink-500 via-red-500 to-cyan-400 hover:from-pink-600 hover:via-red-600 hover:to-cyan-500 border-0"
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <ArrowRight className="h-5 w-5" />
                    )}
                </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
                Paste any TikTok video URL to download without watermark
            </p>
        </form>
    );
}

