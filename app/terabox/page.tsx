"use client";

import { TeraboxDownloadForm } from "@/components/terabox-download-form";

export default function TeraboxPage() {
    return (
        <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center">
            <div className="text-center space-y-6 max-w-3xl mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
                    <span className="bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
                        Terabox
                    </span>{" "}
                    Video Downloader
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground">
                    Download Terabox videos and files for free
                </p>
            </div>

            <div className="w-full max-w-2xl">
                <TeraboxDownloadForm />
            </div>
        </main>
    );
}
