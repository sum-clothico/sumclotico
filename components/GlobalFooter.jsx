"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Footer from "./Footer";

export default function GlobalFooter() {
  const pathname = usePathname();

  // Never render on admin dashboard routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer
      className="global-site-footer"
      style={{
        position: "relative",
        zIndex: 10,
        width: "100%",
        margin: 0,
        padding: 0,
        backgroundColor: "#FAF6F0",
      }}
    >
      <Footer />
    </footer>
  );
}
