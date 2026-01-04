"use client";

import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

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

function isValidTeraboxUrl(url: string): boolean {
    const patterns = [
        /^https?:\/\/(www\.)?terabox\.(app|com)\/.+/i,
        /^https?:\/\/(www\.)?1024tera\.com\/.+/i,
        /^https?:\/\/(www\.)?1024terabox\.com\/.+/i,
        /^https?:\/\/(www\.)?teraboxapp\.com\/.+/i,
    ];
    return patterns.some((pattern) => pattern.test(url));
}

export function TeraboxDownloadForm() {
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
                description: "Please enter a Terabox URL",
            });
            return;
        }

        if (!isValidTeraboxUrl(url)) {
            toast({
                variant: "destructive",
                title: "Invalid URL",
                description: "Please enter a valid Terabox URL",
            });
            return;
        }

        const encodedUrl = encodeURIComponent(url);
        router.push(`/terabox/result?url=${encodedUrl}`);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <TeraboxIcon className="h-5 w-5" />
                    </div>
                    <Input
                        type="text"
                        placeholder="Paste Terabox link here..."
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
                    className="h-12 px-6 font-semibold bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 border-0"
                >
                    {loading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <ArrowRight className="h-5 w-5" />
                    )}
                </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
                Paste any Terabox share link to download files
            </p>
        </form>
    );
}
