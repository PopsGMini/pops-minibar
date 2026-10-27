import type { Metadata } from "next";
import AttributionCapture from "@/components/AttributionCapture";
import ConsentBanner from "@/components/ConsentBanner";
import GoogleMeasurement from "@/components/GoogleMeasurement";
import "./globals.css";

export const metadata: Metadata = {
  title: "POPS Minibar | Proposed minibar systems for Dubai holiday homes",
  description: "Register interest in the proposed POPS Minibar Dubai pilot for holiday-home owners, hosts and property managers.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  robots: { index: true, follow: true },
  openGraph: {
    title: "POPS Minibar | Dubai pilot",
    description: "A proposed physical minibar system for Dubai holiday homes. Compare pilot setups and register qualified interest.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        {children}
        <ConsentBanner />
        <AttributionCapture />
        <GoogleMeasurement
          googleTagId={process.env.NEXT_PUBLIC_GOOGLE_TAG_ID}
          gtmId={process.env.NEXT_PUBLIC_GTM_ID}
        />
      </body>
    </html>
  );
}
