import "./globals.css";

export const metadata = {
  title: "PDFBolt — 17 Free PDF Tools, 100% In-Browser",
  description: "Merge, compress, convert, sign and protect PDFs and images. Everything runs in your browser — we never see your files. Free, no signup.",
  keywords: "PDF tools, merge PDF, compress PDF, convert PDF, PDF to image, image to PDF, sign PDF, free PDF tools, online PDF, privacy",
  authors: [{ name: "PDFBolt" }],
  openGraph: {
    title: "PDFBolt — 17 Free PDF Tools. Zero Uploads.",
    description: "Free PDF and image tools that run 100% in your browser. No server uploads, no signup, absolute privacy.",
    url: "https://pdfbolt.app",
    siteName: "PDFBolt",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "PDFBolt — Free PDF Tools, 100% Private",
    description: "17 free tools for PDFs and images. Runs in your browser, never uploads your files.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://pdfbolt.app" },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#E8523F",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/sw.js')})}`,
          }}
        />
      </body>
    </html>
  );
}
