// app/layout.tsx
import "../styles/globals.css";

import EasterEggs from "../components/EasterEggs";
import SecretModal from "../components/SecretModal";
import RetroStyle from "../components/RetroStyle";
import LeaderboardPrompt from "../components/LeaderboardPrompt";

export const viewport = {
  themeColor: "#ffffff",
};

export const metadata = {
  title: "SamJoorNetwork",
  description: "The world’s #1 professional network… of Sam Joor.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {/* Easter egg features (always available) */}
        <RetroStyle />
        <EasterEggs />
        <SecretModal />
        <LeaderboardPrompt />

        {/* Actual page content */}
        {children}
      </body>
    </html>
  );
}
