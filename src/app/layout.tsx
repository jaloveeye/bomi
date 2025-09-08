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
  description:
    "아이들을 위한 재미있는 수학 연습 게임. 덧셈과 뺄셈을 게임처럼 즐기며 배워보세요!",
  keywords: ["수학", "게임", "교육", "덧셈", "뺄셈", "아이", "학습", "연습"],
  authors: [{ name: "Bomi Team" }],
  creator: "Bomi",
  publisher: "Bomi",
  robots: "index, follow",
  openGraph: {
    title: "보미의 즐거운 수학 놀이",
    description: "아이들을 위한 재미있는 수학 연습 게임",
    type: "website",
    locale: "ko_KR",
    siteName: "보미의 즐거운 수학 놀이",
  },
  twitter: {
    card: "summary",
    title: "보미의 즐거운 수학 놀이",
    description: "아이들을 위한 재미있는 수학 연습 게임",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
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
