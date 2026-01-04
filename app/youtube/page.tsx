"use client";

import { YoutubeDownloadForm } from "@/components/youtube-download-form";

export default function YoutubePage() {
    return (
        <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center">
            <div className="text-center space-y-6 max-w-3xl mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
                        YouTube
                    </span>{" "}
                    Video Downloader
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground">
                    Download YouTube videos in HD quality
                </p>
            </div>

            <div className="w-full max-w-2xl">
                <YoutubeDownloadForm />
            </div>
        </main>
    );
}
