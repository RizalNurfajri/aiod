"use client";

import { FacebookDownloadForm } from "@/components/facebook-download-form";

export default function FacebookPage() {
    return (
        <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center">
            <div className="text-center space-y-6 max-w-3xl mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                        Facebook
                    </span>{" "}
                    Video Downloader
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground">
                    Download Facebook Videos & Reels in HD quality
                </p>
            </div>

            <div className="w-full max-w-2xl">
                <FacebookDownloadForm />
            </div>
        </main>
    );
}
