import { GlowCard } from "@/components/glow-card";
import { Zap, Shield, Music, Download } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
            <div className="space-y-8">
                {/* About Card */}
                <GlowCard className="p-6">
                    <h2 className="text-2xl font-bold mb-4">What is AIOD?</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        AIOD (All In One Downloader) is a modern, fast, and free video downloader that
                        allows you to download videos from TikTok, YouTube, Instagram, Facebook, Terabox,
                        and more. Extract audio in MP3 format and get videos without watermarks.
                        Built with cutting-edge technology for the best user experience.
                    </p>
                </GlowCard>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 gap-4">
                    <GlowCard className="p-6" glowColor="rgba(59, 130, 246, 0.4)">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-blue-500/10">
                                <Zap className="h-6 w-6 text-blue-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                                <p className="text-sm text-muted-foreground">
                                    Download videos in seconds with our optimized serverless architecture
                                </p>
                            </div>
                        </div>
                    </GlowCard>

                    <GlowCard className="p-6" glowColor="rgba(34, 197, 94, 0.4)">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-green-500/10">
                                <Shield className="h-6 w-6 text-green-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2">No Watermark</h3>
                                <p className="text-sm text-muted-foreground">
                                    Get clean videos without any watermarks or branding
                                </p>
                            </div>
                        </div>
                    </GlowCard>

                    <GlowCard className="p-6" glowColor="rgba(168, 85, 247, 0.4)">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-purple-500/10">
                                <Music className="h-6 w-6 text-purple-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2">Audio Extraction</h3>
                                <p className="text-sm text-muted-foreground">
                                    Extract and download audio as high-quality MP3 files
                                </p>
                            </div>
                        </div>
                    </GlowCard>

                    <GlowCard className="p-6" glowColor="rgba(236, 72, 153, 0.4)">
                        <div className="flex items-start gap-4">
                            <div className="p-3 rounded-lg bg-pink-500/10">
                                <Download className="h-6 w-6 text-pink-500" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold mb-2">Free Forever</h3>
                                <p className="text-sm text-muted-foreground">
                                    No subscriptions, no hidden fees, completely free to use
                                </p>
                            </div>
                        </div>
                    </GlowCard>
                </div>

                {/* How It Works */}
                <GlowCard className="p-6" glowColor="rgba(249, 115, 22, 0.4)">
                    <h2 className="text-2xl font-bold mb-6">How It Works</h2>
                    <div className="space-y-4">
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                1
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-1">Copy the Video URL</h3>
                                <p className="text-sm text-muted-foreground">
                                    Open your favorite platform (TikTok, YouTube, Instagram, Facebook, or Terabox),
                                    find the video you want to download, and copy its URL
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                2
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-1">Paste the URL</h3>
                                <p className="text-sm text-muted-foreground">
                                    Paste the copied URL into the input field on our homepage
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                3
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-1">Click the Arrow</h3>
                                <p className="text-sm text-muted-foreground">
                                    Our serverless backend processes the URL and fetches the video
                                    data instantly
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                                4
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold mb-1">Get Your Files</h3>
                                <p className="text-sm text-muted-foreground">
                                    Download the video without watermark or extract the audio as
                                    MP3
                                </p>
                            </div>
                        </div>
                    </div>
                </GlowCard>
            </div>
        </main>
    );
}
