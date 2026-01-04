"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ResultCard } from "@/components/result-card";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft } from "lucide-react";

function ResultContent() {
    const searchParams = useSearchParams();
    const url = searchParams.get("url");
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        if (!url) {
            router.push("/tiktok");
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch('/api/download', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ url }),
                });
                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.error || "Failed to fetch video data");
                }

                setData(result.data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, router]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Fetching video information...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-4">
                <div className="bg-destructive/10 text-destructive p-4 rounded-full mb-4">
                    <ArrowLeft className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Download Failed</h2>
                <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
                <Button onClick={() => router.push("/tiktok")}>Try Another URL</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button
                variant="ghost"
                onClick={() => router.back()}
                className="mb-6 hover:bg-transparent hover:text-primary -ml-4"
            >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
            {data && <ResultCard data={data} />}
        </div>
    );
}

export default function ResultPage() {
    return (
        <Suspense fallback={
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <ResultContent />
        </Suspense>
    );
}
