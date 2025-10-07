import "../styles/globals.css";

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
        {/* Global overlays that don't need props can stay here */}
        {/* <RetroStyle /> */}
        {/* <EasterEggs /> */}
        {/* <SecretModal /> */}

        {/* Do NOT render <LeaderboardPrompt /> here. */}
        {children}
      </body>
    </html>
  );
}
