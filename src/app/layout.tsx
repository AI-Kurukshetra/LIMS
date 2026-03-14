import type { Metadata } from "next";

import "@/app/globals.css";

export const metadata: Metadata = {
  title: "LabAxis | Laboratory Operations Platform",
  description:
    "LabAxis is modern laboratory operations software built to manage samples, testing, reporting, inventory, and compliance in one place."
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
