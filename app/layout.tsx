import "../styles/globals.css";

export const viewport = {
  themeColor: "#ffffff", //right place for themcolor
};

export const metadata = {
  title: "SamJoorNetwork",
  description: "The world’s #1 professional network… of Sam Joor.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" }, // modern browsers
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" }, // fallback
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }, // iOS home screen
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
