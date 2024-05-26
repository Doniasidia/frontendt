import "@/components/globals.css";
import React from "react";
import { cn } from "@/utils/tailwindUtil";
import { libre_franklin } from "@/components/fonts";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(libre_franklin.className, "antialiased")}
    >
      <body>{children}</body>
    </html>
  );
}
