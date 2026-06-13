import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Mission 2028 Command Center",
  description: "Field-ready tracker for the Sirpur Kaghaznagar mission",
  manifest: "/manifest.json",
  themeColor: "#1F3864",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <main style={{ maxWidth: 880, margin: "0 auto", padding: "24px 16px" }}>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
