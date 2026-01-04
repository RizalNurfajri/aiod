"use client";

import { InstagramDownloadForm } from "@/components/instagram-download-form";

export default function InstagramPage() {
    return (
        <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center">
            <div className="text-center space-y-6 max-w-3xl mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                        Instagram
                    </span>{" "}
                    Video Downloader
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground">
                    Download Instagram Reels, Posts & Videos for free
                </p>
            </div>

            <div className="w-full max-w-2xl">
                <InstagramDownloadForm />
            </div>
        </main>
    );
}
