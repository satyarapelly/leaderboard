import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
export const metadata: Metadata = { title:"Mission 2028 Command Center", description:"Field-ready tracker for the Sirpur Kaghaznagar mission", manifest:"/manifest.json", themeColor:"#173a35" };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Providers>{children}</Providers></body></html>}
