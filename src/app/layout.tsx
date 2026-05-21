import type { Metadata } from "next";
import localFont from "next/font/local";
import { QueryProvider } from "@/providers/query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { Toaster } from "sonner";
import "./globals.css";

const aeonik = localFont({
  src: [
    {
      path: "../../fonts/fonnts.com-Aeonik-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/fonnts.com-Aeonik-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-aeonik",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Entivia | Real-Time Intelligence",
  description:
    "Open-source user modeling and recommendation intelligence for operational teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased ${aeonik.variable}`}>
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
