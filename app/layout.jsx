import "./globals.css";
import { StoreProvider } from "@/context/StoreContext";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import ProductQuickView from "@/components/ProductQuickView";

export const metadata = {
  title: "SUM CLOTHICO — Handcrafted Khadi Textiles",
  description:
    "SUM CLOTHICO is a textile brand rooted in the tradition of khadi, offering handcrafted fabrics and sustainable fashion for the conscious consumer.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <StoreProvider>
          {children}
          <CartDrawer />
          <AuthModal />
          <ProductQuickView />
        </StoreProvider>
      </body>
    </html>
  );
}
