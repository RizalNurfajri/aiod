"use client";

import { Button } from "@/components/ui/button";
import { Download, Facebook, Sparkles } from "lucide-react";

interface QualityOption {
    resolution: string;
    url: string;
}

interface FacebookData {
    all_qualities: QualityOption[];
    best_quality: string;
    best_url: string;
    source: string;
}

interface FacebookResultCardProps {
    data: FacebookData;
}

export function FacebookResultCard({ data }: FacebookResultCardProps) {
    const handleDownload = (url: string) => {
        const a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="rounded-xl border bg-card overflow-hidden shadow-lg">
                {/* Header */}
                <div className="p-4 border-b bg-gradient-to-r from-blue-500/10 to-blue-700/10">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                            <Facebook className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <span className="font-semibold text-foreground">Facebook Download</span>
                            <p className="text-sm text-muted-foreground">
                                {data.all_qualities.length} quality option{data.all_qualities.length > 1 ? "s" : ""} available
                            </p>
                        </div>
                    </div>
                </div>

                {/* Best Quality Download */}
                <div className="p-4 border-b bg-gradient-to-r from-blue-500/5 to-transparent">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="h-4 w-4 text-blue-500" />
                        <h4 className="text-sm font-medium text-foreground">
                            Best Quality: {data.best_quality}
                        </h4>
                    </div>
                    <Button
                        onClick={() => handleDownload(data.best_url)}
                        className="w-full h-12 gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                    >
                        <Download className="h-5 w-5" />
                        Download Best Quality ({data.best_quality})
                    </Button>
                </div>

                {/* All Quality Options */}
                <div className="p-4 space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">
                        All Quality Options
                    </h4>
                    <div className="grid gap-2">
                        {data.all_qualities.map((quality, index) => (
                            <Button
                                key={index}
                                onClick={() => handleDownload(quality.url)}
                                variant="outline"
                                className="w-full h-11 gap-2 justify-start"
                            >
                                <Download className="h-4 w-4" />
                                Download {quality.resolution}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
