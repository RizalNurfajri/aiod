"use client";

import { DownloadForm } from "@/components/download-form";

export default function TikTokPage() {
    return (
        <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center">
            <div className="text-center space-y-6 max-w-3xl mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-pink-500 via-red-500 to-cyan-400 bg-clip-text text-transparent">
                        TikTok
                    </span>{" "}
                    Video Downloader
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground">
                    Download video TikTok tanpa watermark dengan kualitas terbaik
                </p>
            </div>

            <div className="w-full max-w-2xl">
                <DownloadForm />
            </div>
        </main>
    );
}
