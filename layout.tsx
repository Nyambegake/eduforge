import "./globals.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import Header from "@/components/Header";
import AuthGate from "@/components/AuthGate";
const font = Bricolage_Grotesque({ subsets:["latin"], variable:"--font-body" });
export const metadata: Metadata = { title:"EduForge Learning Hub", description:"Integrated Learning and Technical Training Ecosystem. Learn. Assess. Train. Innovate." };
export default function RootLayout({ children }:{ children: React.ReactNode }) {
  return (<html lang="en"><body className={`${font.variable} font-sans bg-mist text-ink`}>
    <Header /><AuthGate>{children}</AuthGate>
    <footer className="bg-ink text-mist/80 px-6 py-8 text-sm">© EduForge Learning Hub. Learn. Assess. Train. Innovate.</footer>
  </body></html>);
}
