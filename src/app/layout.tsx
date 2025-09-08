import type { Metadata } from "next";
import { Geist, Geist_Mono, Jua } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const jua = Jua({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-kid",
});

export const metadata: Metadata = {
  title: "보미의 즐거운 수학 놀이",
  description: "Bomi - fun math practice for kids",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${jua.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
