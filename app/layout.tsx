import type { Viewport } from "next";
import "../styles/globals.css";
import EasterEggs from "@/components/EasterEggs";
import SecretModal from "@/components/SecretModal";
import RetroStyle from "@/components/RetroStyle";

export const viewport: Viewport = {
  themeColor: "#020403",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const SITE_URL = "https://samjoor.com";
const SITE_TITLE = "SamJoor.com";
const SITE_DESCRIPTION =
  "Sam Joor's portfolio: projects, security labs, data tools, chess, and hidden surprises.";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: "/favicon.ico?v=7", sizes: "32x32" },
      { url: "/favicon-64.png?v=7", type: "image/png", sizes: "64x64" },
    ],
    shortcut: [{ url: "/favicon.ico?v=7" }],
    apple: [{ url: "/favicon-64.png?v=7", type: "image/png", sizes: "64x64" }],
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_TITLE,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SamJoor.com" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen" suppressHydrationWarning>
        {children}
        <EasterEggs />
        <SecretModal />
        <RetroStyle />
      </body>
    </html>
  );
}
