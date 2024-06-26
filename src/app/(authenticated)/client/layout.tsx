
import React from "react";
import ClientSidebar from "./_components/clientSidebar";
import ToastContainerWrapper from "@/components/toast-wrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <ClientSidebar />
      </div>
      <main className="grow p-6 md:overflow-y-auto md:p-12">{children}</main>
      <ToastContainerWrapper />
    </div>
  );
}
