"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { YoutubeResultCard } from "@/components/youtube-result-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

function YoutubeResultContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const url = searchParams.get("url");

    if (!url) {
        router.push("/youtube");
        return null;
    }

    const videoUrl = decodeURIComponent(url);

    return (
        <main className="flex-1 container mx-auto px-4 py-12">
            <div className="max-w-2xl mx-auto mb-6">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/youtube")}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to YouTube
                </Button>
            </div>

            <YoutubeResultCard videoUrl={videoUrl} />
        </main>
    );
}

export default function YoutubeResultPage() {
    return (
        <Suspense
            fallback={
                <main className="flex-1 container mx-auto px-4 py-12">
                    <div className="w-full max-w-2xl mx-auto space-y-4">
                        <Skeleton className="aspect-video w-full rounded-xl" />
                        <Skeleton className="h-8 w-3/4" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </div>
                </main>
            }
        >
            <YoutubeResultContent />
        </Suspense>
    );
}
