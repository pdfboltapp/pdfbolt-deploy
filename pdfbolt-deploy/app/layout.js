import "./globals.css";

export const metadata = {
  title: "PDFBolt — Strumenti PDF nel browser, istantanei e privati",
  description: "Unisci, comprimi, converti, dividi e proteggi i tuoi PDF. 100% nel browser, nessun upload su server. Gratis.",
  keywords: "PDF, unisci PDF, comprimi PDF, converti PDF, strumenti PDF online, PDF gratis, privacy PDF",
  authors: [{ name: "PDFBolt" }],
  openGraph: {
    title: "PDFBolt — I tuoi PDF, alla velocità del fulmine",
    description: "Strumenti PDF istantanei, privati e gratuiti. Tutto nel browser, nessun upload.",
    url: "https://pdfbolt.app",
    siteName: "PDFBolt",
    type: "website",
    locale: "it_IT",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFBolt — Strumenti PDF istantanei e privati",
    description: "Unisci, comprimi, converti PDF. 100% nel browser. Gratis.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://pdfbolt.app" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
