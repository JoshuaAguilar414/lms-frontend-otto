import type { Metadata } from "next";
import { SiteLayout } from "@/components/layout";
import "./globals.css";

export const metadata: Metadata = {
  title: "Otto Group: LMS",
  description: "Enabling Positive Impact - Training & Learning Management",
  icons: {
    icon: "https://static.ottogroup.com/wLayout22/wGlobal/layout/images/site-icons/favicon-32x32.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <SiteLayout>{children}</SiteLayout>
      </body>
    </html>
  );
}
