import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs'
import { Toaster } from "react-hot-toast";
import { ContextProvider } from "@/context";
import Script from "next/script";
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

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="beforeInteractive" />

        <ClerkProvider>
          <ContextProvider>
            <Toaster />
            {children}
          </ContextProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
