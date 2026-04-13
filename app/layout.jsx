import "./globals.css";

export const metadata = {
  title: "SUM CLOTHICO — Handcrafted Khadi Textiles",
  description:
    "SUM CLOTHICO is a textile brand rooted in the tradition of khadi, offering handcrafted fabrics and sustainable fashion for the conscious consumer.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
