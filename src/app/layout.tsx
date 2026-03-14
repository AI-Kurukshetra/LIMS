import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "NextGen LIMS",
  description: "Production-ready laboratory information management dashboard."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">{children}</body>
    </html>
  );
}
