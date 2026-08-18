import type { Metadata } from "next";
import { Toaster } from "sonner";
import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="h-full antialiased">
      <body className="adm-scope min-h-full bg-adm-bg font-body text-adm-text">
        {children}
        <Toaster theme="light" position="bottom-right" richColors />
      </body>
    </html>
  );
}
