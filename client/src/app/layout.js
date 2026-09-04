import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { NavbarProvider } from "@/contexts/NavbarContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { GuestProvider } from "@/contexts/GuestContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: "KnowBase AI-Powered Knowledge Management Platform",
  description:
    "Capture, organize, and intelligently surface your knowledge with AI-powered semantic search",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <GuestProvider>
          <AuthProvider>
            <NavbarProvider>
              {children}
            </NavbarProvider>
          </AuthProvider>
        </GuestProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1f2937",
              color: "#fff",
              borderRadius: "12px",
            },
            success: {
              style: {
                background: "#059669",
              },
            },
            error: {
              style: {
                background: "#dc2626",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
