import { Libre_Franklin } from "next/font/google";

import "@/components/globals.css";
import React from "react";
import { cn } from "@/lib/utils";
import ToastProvider from "@/providers/toast-provider";

const libre_franklin = Libre_Franklin({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-libre_franklin",
});

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
