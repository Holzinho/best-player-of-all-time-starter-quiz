import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Best Player of All Time Quiz",
  description: "Test your knowledge of the greatest players ever",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
