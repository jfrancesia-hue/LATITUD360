import type { Metadata, Viewport } from "next";
import { APP_NAME, APP_TAGLINE, APP_DESCRIPTION } from "@latitud360/shared";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: `${APP_NAME} — ${APP_TAGLINE}`, template: `%s · ${APP_NAME}` },
  description: APP_DESCRIPTION,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  robots: { index: false, follow: false }, // dashboard privado
};

export const viewport: Viewport = {
  themeColor: "#0A0A0A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR">
      <body className="min-h-screen bg-mina text-artico font-body antialiased">
        {children}
      </body>
    </html>
  );
}
