import "../styles/globals.css";

export const metadata = {
  title: "SamJoorNetwork",
  description: "The world’s #1 professional network… of Sam Joor.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
