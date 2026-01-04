"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ResultCard } from "@/components/result-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface VideoData {
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
}

function ResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [result, setResult] = useState<VideoData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const url = searchParams.get("url");

        if (!url) {
            router.push("/");
            return;
        }

        const fetchVideo = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch("/api/download", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ url: decodeURIComponent(url) }),
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.error || "Failed to download video");
                }

                setResult(data.data);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to process TikTok video. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [searchParams, router]);

    return (
        <main className="flex-1 container mx-auto px-4 py-12">
            {/* Back Button */}
            <div className="max-w-2xl mx-auto mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/")}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Button>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="w-full max-w-2xl mx-auto space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-64 w-full" />
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <Skeleton className="h-20" />
                        <Skeleton className="h-20" />
                        <Skeleton className="h-20" />
                        <Skeleton className="h-20" />
                    </div>
                    <Skeleton className="h-12 w-full" />
                </div>
            )}

            {/* Error State */}
            {error && !loading && (
                <div className="w-full max-w-2xl mx-auto">
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
                        <h3 className="font-semibold text-destructive mb-2">Error</h3>
                        <p className="text-sm text-muted-foreground mb-4">{error}</p>
                        <Button onClick={() => router.push("/")}>Try Again</Button>
                    </div>
                </div>
            )}

            {/* Result */}
            {result && !loading && !error && (
                <div className="animate-fade-in">
                    <ResultCard data={result} />
                </div>
            )}
        </main>
    );
}

export default function ResultPage() {
    return (
        <Suspense
            fallback={
                <main className="flex-1 container mx-auto px-4 py-12">
                    <div className="w-full max-w-2xl mx-auto space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </main>
            }
        >
            <ResultContent />
        </Suspense>
    );
}
