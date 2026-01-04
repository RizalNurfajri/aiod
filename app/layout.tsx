import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeToggle } from "@/components/theme-toggle";
import { SidebarNav } from "@/components/sidebar-nav";
import Link from "next/link";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AIOD - All In One Downloader",
    description:
        "Download videos from TikTok, YouTube, Instagram, Facebook, Terabox and more. Fast, simple, and free all-in-one video downloader.",
    keywords: [
        "video downloader",
        "tiktok downloader",
        "youtube downloader",
        "instagram downloader",
        "facebook downloader",
        "terabox downloader",
        "all in one downloader",
    ],
    authors: [{ name: "AIOD" }],
    icons: {
        icon: "/logo.png",
        shortcut: "/logo.png",
        apple: "/logo.png",
    },
    openGraph: {
        title: "AIOD - All In One Downloader",
        description: "Download videos from TikTok, YouTube, Instagram, Facebook, Terabox and more",
        type: "website",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                >
                    <div className="min-h-screen flex flex-col">
                        {/* Header */}
                        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                            <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                                <Link href="/" className="flex items-center space-x-2">
                                    <Image
                                        src="/logo.png"
                                        alt="AIOD Logo"
                                        width={32}
                                        height={32}
                                        className="w-8 h-8"
                                        priority
                                    />
                                    <h1 className="text-xl font-bold text-foreground">
                                        AIOD
                                    </h1>
                                </Link>
                                <nav className="flex items-center gap-0.5">
                                    <Link
                                        href="/about"
                                        className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mr-1"
                                    >
                                        About
                                    </Link>
                                    <ThemeToggle />
                                    <SidebarNav />
                                </nav>
                            </div>
                        </header>

                        {/* Main Content */}
                        {children}

                        {/* Footer */}
                        <footer className="border-t py-4 mt-auto">
                            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                                <p>© 2025 AIOD</p>
                            </div>
                        </footer>
                    </div>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
