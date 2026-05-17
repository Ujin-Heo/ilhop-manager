import type { Metadata } from "next";
import "@/components/globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { getMetadata } from "@/lib/api/metadata";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export async function generateMetadata(): Promise<Metadata> {
  try {
    const meta = await getMetadata();
    const title = meta.title || "그루터기 일일호프";
    return {
      title: title,
      description: `${title} 웹사이트입니다.`,
    };
  } catch (error) {
    console.error("Failed to fetch metadata for layout:", error);
    return {
      title: "그루터기 일일호프",
      description: "그루터기 일일호프 웹사이트입니다.",
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={cn("font-sans", inter.variable)}>
      <body>{children}</body>
    </html>
  );
}
