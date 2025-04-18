import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { metadata as data } from "@/app/lib/metadata"
const geistSans = Poppins({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: "300"
});

const geistMono = Poppins({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: "500"
});

export const metadata: Metadata = data;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <link rel="shortcut icon" href="/icon.png" type="image/png" />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
