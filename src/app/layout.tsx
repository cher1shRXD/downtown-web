import type { Metadata } from "next";
import "./globals.css";
import LoadingProvider from "@/shared/providers/LoadingProvider";
import ToastContainer from "@/shared/providers/ToastProvider";
import QueryProvider from "@/shared/providers/QueryProvider";

export const metadata: Metadata = {
  title: "Downtown Web",
  description: "Downtown Web Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <LoadingProvider color="#F54900" />
        <ToastContainer />
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
