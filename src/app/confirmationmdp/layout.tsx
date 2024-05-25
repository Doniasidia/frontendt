import ToastContainerWrapper from "@/components/toast-wrapper";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main>{children}</main>
      <ToastContainerWrapper />
    </div>
  );
}
