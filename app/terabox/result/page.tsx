"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { TeraboxResultCard } from "@/components/terabox-result-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface TeraboxFile {
    filename: string;
    size: number;
    size_format: string;
    thumbnail: string;
    download: string;
    direct_link: string;
}

function TeraboxResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [files, setFiles] = useState<TeraboxFile[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const url = searchParams.get("url");

        if (!url) {
            router.push("/terabox");
            return;
        }

        const fetchFiles = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch("/api/terabox", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ url: decodeURIComponent(url) }),
                });

                const data = await response.json();

                if (!response.ok || !data.success) {
                    throw new Error(data.error || "Failed to fetch files");
                }

                setFiles(data.files);
                setTotal(data.total);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : "Failed to process Terabox link. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, [searchParams, router]);

    return (
        <main className="flex-1 container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/terabox")}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Terabox
                </Button>
            </div>

            {loading && (
                <div className="w-full max-w-4xl mx-auto space-y-4">
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Skeleton className="h-48" />
                        <Skeleton className="h-48" />
                        <Skeleton className="h-48" />
                        <Skeleton className="h-48" />
                    </div>
                </div>
            )}

            {error && !loading && (
                <div className="w-full max-w-4xl mx-auto">
                    <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
                        <h3 className="font-semibold text-destructive mb-2">Error</h3>
                        <p className="text-sm text-muted-foreground mb-4">{error}</p>
                        <Button onClick={() => router.push("/terabox")}>Try Again</Button>
                    </div>
                </div>
            )}

            {files.length > 0 && !loading && !error && (
                <div className="animate-fade-in">
                    <TeraboxResultCard files={files} total={total} />
                </div>
            )}
        </main>
    );
}

export default function TeraboxResultPage() {
    return (
        <Suspense
            fallback={
                <main className="flex-1 container mx-auto px-4 py-12">
                    <div className="w-full max-w-4xl mx-auto space-y-4">
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Skeleton className="h-48" />
                            <Skeleton className="h-48" />
                        </div>
                    </div>
                </main>
            }
        >
            <TeraboxResultContent />
        </Suspense>
    );
}
