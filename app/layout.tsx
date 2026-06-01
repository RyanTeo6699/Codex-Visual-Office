import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Codex Visual Office",
  description: "Local-first visual prototype for ChatGPT and Codex workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
