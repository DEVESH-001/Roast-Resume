import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Figtree } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://roast.devesh.work";

const normalizedSiteUrl = siteUrl.endsWith("/")
  ? siteUrl.slice(0, -1)
  : siteUrl;

const siteTitle = "Roast My Resume – Savage AI Resume & GitHub Roast";
const siteDescription =
  "Upload your resume and let an AI tech recruiter ruthlessly roast your experience, skills, GitHub, and LinkedIn in seconds.";

export const metadata: Metadata = {
  metadataBase: new URL(normalizedSiteUrl),
  title: siteTitle,
  description: siteDescription,
  keywords: [
    "AI resume review",
    "resume roast",
    "GitHub roast",
    "LinkedIn roast",
    "AI career feedback",
    "developer resume critique",
  ],
  alternates: {
    canonical: normalizedSiteUrl,
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    url: normalizedSiteUrl,
    siteName: "Roast My Resume",
    images: [
      {
        url: "/og.png",
        width: 2692,
        height: 1470,
        alt: "Roast My Resume – AI-powered resume and GitHub roast",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/og.png"],
    creator: "@devesh",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Roast My Resume",
    url: normalizedSiteUrl,
    description: siteDescription,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    creator: {
      "@type": "Person",
      name: "Devesh",
      url: normalizedSiteUrl,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    featureList: [
      "AI resume roast",
      "GitHub profile analysis",
      "LinkedIn URL analysis",
      "Tech stack critique",
    ],
  };

  return (
    <html lang="en" className={figtree.variable}>
      <head>
        <link rel="canonical" href={siteUrl} />
        <Script
          id="ld-json-roast-my-resume"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}
