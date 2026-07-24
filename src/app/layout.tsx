import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { SmoothScrollProvider } from "@/providers/smooth-scroll-provider";
import { MotionProvider } from "@/providers/motion-provider";
import { MagneticCursor } from "@/components/ui/magnetic-cursor";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { ConsoleSignature } from "@/components/ui/console-signature";
import "@/styles/globals.css";


const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://devclub-jemerson.netlify.app"),
  title: {
    default: "DevClub | A evolução do desenvolvedor começa aqui",
    template: "%s | DevClub",
  },
  description:
    "Do primeiro console.log ao primeiro emprego full stack. Uma jornada completa para quem quer se tornar um desenvolvedor extraordinário.",
  keywords: [
    "curso de programação",
    "aprender a programar",
    "desenvolvedor full stack",
    "bootcamp de tecnologia",
    "DevClub",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "DevClub | A evolução do desenvolvedor começa aqui",
    description:
      "Do primeiro console.log ao primeiro emprego full stack. Uma jornada completa para quem quer se tornar um desenvolvedor extraordinário.",
    locale: "pt_BR",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevClub | A evolução do desenvolvedor começa aqui",
    description:
      "Do primeiro console.log ao primeiro emprego full stack. Uma jornada completa para quem quer se tornar um desenvolvedor extraordinário.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: "DevClub",
    url: "https://devclub-jemerson.netlify.app",
    description:
      "Formação completa em desenvolvimento web, do primeiro console.log ao primeiro emprego full stack.",
    sameAs: [
      "https://instagram.com",
      "https://linkedin.com",
      "https://youtube.com",
    ],
  };

  return (
    <html
      lang="pt-BR"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <a
          href="#main-content"
          className="sr-only-focusable fixed left-4 top-4 z-[200] rounded-full bg-accent-cyan px-5 py-2.5 font-medium text-bg-primary"
        >
          Pular para o conteúdo
        </a>
        <div className="grain-overlay" aria-hidden />
        <ScrollProgress />
        <ConsoleSignature />
        <MagneticCursor />
        <MotionProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
