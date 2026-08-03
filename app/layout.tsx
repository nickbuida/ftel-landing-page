import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "FPT Telecom Career Booming",
    description: "Khám phá cơ hội nghề nghiệp dành cho sinh viên tại FPT Telecom.",
    icons: {
      icon: "/assets/logo.png",
      shortcut: "/assets/logo.png",
    },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url: origin,
      title: "FPT Telecom Career Booming",
      description: "Khám phá cơ hội nghề nghiệp dành cho sinh viên tại FPT Telecom.",
      images: [{ url: `${origin}/og.png`, width: 1730, height: 909, alt: "FPT Telecom Career Booming" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "FPT Telecom Career Booming",
      description: "Khám phá cơ hội nghề nghiệp dành cho sinh viên tại FPT Telecom.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
