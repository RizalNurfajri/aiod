"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { InstagramResultCard } from "@/components/instagram-result-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface MediaItem {
    ext: string;
    name: string;
    type: string;
    url: string;
    thumbnail?: string;
}

function InstagramResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [result, setResult] = useState<MediaItem[]>([]);
    const [title, setTitle] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const url = searchParams.get("url");

        if (!url) {
            router.push("/instagram");
            return;
        }

        const fetchVideo = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch("/api/instagram", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url: decodeURIComponent(url) }),
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.error || "Failed to download video");
                }

                setResult(data.data);
                setTitle(data.title || "");
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to process Instagram video. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchVideo();
    }, [searchParams, router]);

    return (
        <main className="flex-1 container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/instagram")}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Instagram
                </Button>
            </div>

            {loading && (
                <div className="w-full max-w-4xl mx-auto space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-64 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            )}

            {error && !loading && (
                <div className="w-full max-w-4xl mx-auto">
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
                        <h3 className="font-semibold text-destructive mb-2">Error</h3>
                        <p className="text-sm text-muted-foreground mb-4">{error}</p>
                        <Button onClick={() => router.push("/instagram")}>Try Again</Button>
                    </div>
                </div>
            )}

            {result.length > 0 && !loading && !error && (
                <div className="animate-fade-in">
                    <InstagramResultCard data={result} title={title} />
                </div>
            )}
        </main>
    );
}

export default function InstagramResultPage() {
    return (
        <Suspense
            fallback={
                <main className="flex-1 container mx-auto px-4 py-12">
                    <div className="w-full max-w-4xl mx-auto space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </main>
            }
        >
            <InstagramResultContent />
        </Suspense>
    );
}

