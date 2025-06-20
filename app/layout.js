import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Poppins } from 'next/font/google';
import { Quicksand } from 'next/font/google';

const quicksand = Quicksand({
  subsets: ['latin'],
  weight: ['300', '400', '700'], // choose needed weights
  style: ['normal'], // optional: add italic if needed
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'], // specify the font weights you need
  style: ['normal', 'italic'], // optional: include italic styles if needed
  display: 'swap',
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "EduPulse",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={quicksand.className}
      >
        {children}
      </body>
    </html>
  );
}
