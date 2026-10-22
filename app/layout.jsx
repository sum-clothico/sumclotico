import "./globals.css";
import Script from "next/script";
import { ClerkProvider } from "@clerk/nextjs";
import { StoreProvider } from "@/context/StoreContext";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import ProductQuickView from "@/components/ProductQuickView";
import SearchModal from "@/components/SearchModal";
import SizeGuideModal from "@/components/SizeGuideModal";
import WhatsAppWidget from "@/components/WhatsAppWidget";
import WelcomePromoModal from "@/components/WelcomePromoModal";
import CampaignTracker from "@/components/CampaignTracker";
import UserSyncManager from "@/components/UserSyncManager";

export const metadata = {
  metadataBase: new URL("https://sumclotico.com"),
  title: "SUM CLOTHICO — Handcrafted Khadi Textiles & Sustainable Luxury",
  description:
    "SUM CLOTHICO is a textile brand rooted in the tradition of pure Indian khadi, offering handcrafted silhouettes, effortless tops, and sustainable fashion for mindful living.",
  keywords: "Khadi, Indian Textiles, Handloom Tops, Organic Cotton, Sustainable Fashion, Sum Clothico",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "SUM CLOTHICO — Handcrafted Khadi Textiles",
    description: "Slowly made. Easy to wear. Hard to replace.",
    url: "https://sumclotico.com",
    siteName: "Sum Clothico",
    images: [
      {
        url: "/assets/img/14.png",
        width: 1200,
        height: 630,
        alt: "Sum Clothico Handcrafted Khadi Collection",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-4PDRN1Q81Y";

const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

if (process.env.NODE_ENV === "production" && !CLERK_PUBLISHABLE_KEY) {
  // Fail loud in prod so bad-env Clerk SDK doesn't poison React portal (causes removeChild NotFoundError on /sign-in)
  console.error("[Clerk] NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY missing in production.");
}

import GlobalFooter from "@/components/GlobalFooter";

export default function RootLayout({ children }) {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY || undefined}>
      <html lang="en" translate="no" suppressHydrationWarning>
        <head>
          {/* Google Analytics 4 (GA4) Tracking Scripts */}
          {GA_MEASUREMENT_ID && (
            <>
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    window.gtag = gtag;
                    gtag('js', new Date());
                    gtag('config', '${GA_MEASUREMENT_ID}', {
                      page_path: window.location.pathname,
                      debug_mode: true
                    });
                  `,
                }}
              />
            </>
          )}
        </head>
        <body suppressHydrationWarning>
          <StoreProvider>
            {children}
            <GlobalFooter />
            <CartDrawer />
            <AuthModal />
            <ProductQuickView />
            <SearchModal />
            <SizeGuideModal />
            <WhatsAppWidget />
            <WelcomePromoModal />
            <CampaignTracker />
            <UserSyncManager />
          </StoreProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

