import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "HuisDirect Vind jouw perfecte woning",
  description:
    "Bekijk woningen door heel Nederland. Eenvoudig, transparant en altijd actueel.",
};

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={inter.variable}>
      <head>
        <meta
          name="google-site-verification"
          content="UsQxJN917Xkqvz_kEAJgf6l82-ap2cBV4HftNFoSS0k"
        />

        {PIXEL_ID && (
          <>
            {/* Meta Pixel */}
            <Script id="facebook-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;
                n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];
                t=b.createElement(e);t.async=!0;
                t.src=v;
                s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}
                (window, document,'script','https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${PIXEL_ID}');
                fbq('track', 'PageView');
              `}
            </Script>
          </>
        )}
      </head>

      <body
        className={`${inter.variable} font-sans antialiased bg-white text-neutral-900`}
      >
        {/* fallback voor no-script */}
        {PIXEL_ID && (
          <noscript>
            <img
              height="1"
              width="1"
              style={{ display: "none" }}
              src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
              alt=""
            />
          </noscript>
        )}

        {children}
      </body>
    </html>
  );
}