import type { Viewport } from "next";
import "../styles/globals.css";

export const viewport: Viewport = {
  themeColor: "#020403",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata = {
  title: "SamJoor.com",
  description:
    "Sam Joor's portfolio: projects, security labs, data tools, chess, and hidden surprises.",
  icons: {
    icon: [
      { url: "/favicon.ico?v=7", sizes: "32x32" },
      { url: "/favicon-64.png?v=7", type: "image/png", sizes: "64x64" },
    ],
    shortcut: [{ url: "/favicon.ico?v=7" }],
    apple: [{ url: "/favicon-64.png?v=7", type: "image/png", sizes: "64x64" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
