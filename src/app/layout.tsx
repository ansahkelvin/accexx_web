import type { Metadata } from "next";
import "./globals.css";
import { Inter, Roboto_Condensed } from "next/font/google";
import React from "react";

// Load Inter font
const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

// Load Roboto Condensed font
const robotoCondensed = Roboto_Condensed({
    subsets: ["latin"],
    variable: "--font-roboto-condensed",
    weight: ["300", "400", "700"], // Adjust weights as needed
});


export const metadata: Metadata = {
  title: "Accexx 247",
  description: "Medical booking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html  lang="en">
      <body
          className={`${inter.variable} ${robotoCondensed.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
