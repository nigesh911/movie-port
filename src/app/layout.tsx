import type { Metadata } from "next";
import { Inter } from 'next/font/google';
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { UserProvider } from '@auth0/nextjs-auth0/client';
import { WatchedMoviesProvider } from '@/contexts/WatchedMoviesContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: "Movie Portfolio",
  description: "Your personal movie collection and portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <WatchedMoviesProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </WatchedMoviesProvider>
        </UserProvider>
      </body>
    </html>
  );
}
