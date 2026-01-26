import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Booba Confesse - Fais-le avouer",
  description: "Fais avouer Booba. La vérité sort enfin.",
  openGraph: {
    title: "Booba Confesse",
    description: "Fais avouer Booba. La vérité sort enfin.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
