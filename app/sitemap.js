export default async function sitemap() {
  const baseUrl = "https://sumclotico.com";
  const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const staticRoutes = [
    "",
    "/collection",
    "/our-story",
    "/fabric",
    "/about",
    "/track-order",
    "/contact",
    "/faq",
    "/size-guide",
    "/policies/shipping",
    "/policies/returns",
    "/policies/privacy",
    "/policies/terms",
    "/policies/cancellation",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === "" || route === "/collection" ? "daily" : "monthly",
    priority: route === "" ? 1.0 : route === "/collection" ? 0.9 : 0.7,
  }));

  // Dynamically include individual product pages
  let productRoutes = [];
  try {
    const res = await fetch(`${backendUrl}/products`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      productRoutes = (data.products || []).map((p) => ({
        url: `${baseUrl}/product/${p.slug}`,
        lastModified: p.updatedAt || new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.85,
      }));
    }
  } catch {
    // Silently skip product routes if backend unreachable at build time
  }

  return [...staticRoutes, ...productRoutes];
}

