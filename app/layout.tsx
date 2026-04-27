import type { Metadata } from "next";
// (Biarkan import font bawaan Anda di sini, misalnya Inter atau Geist)
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// --- BAGIAN INI YANG MENGUBAH NAMA TAB DAN PREVIEW LINK ---
export const metadata: Metadata = {
  title: "Confess Web", // <--- Tulisan ini yang akan muncul di Tab Browser
  description: "Ada sebuah pesan untukmu...",
  openGraph: {
    title: "Ada Pesan Untukmu... 💌",
    description: "Coba buka link ini deh, ada sesuatu yang mau aku sampein langsung ke kamu.",
    url: "https://confession-web-psi.vercel.app", 
    siteName: "Confess Web",
    images: [
      {
        url: "https://media.tenor.com/9n_l9T-Vb_AAAAAi/peach-goma-peach-and-goma.gif", 
        width: 800,
        height: 600,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}