import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json({
      isLive: false,
      message: "INSTAGRAM_ACCESS_TOKEN not set.",
      posts: [],
    });
  }

  try {
    let posts = [];

    // 1. Meta / Facebook Graph API Token (starts with EAA...)
    if (token.startsWith("EAA")) {
      const pageRes = await fetch(
        `https://graph.facebook.com/v21.0/me/accounts?fields=name,instagram_business_account{id,username,media{id,caption,media_type,media_url,permalink,thumbnail_url,timestamp}}&access_token=${token}`,
        { next: { revalidate: 3600 } }
      );

      if (pageRes.ok) {
        const pageData = await pageRes.json();
        const pages = pageData.data || [];
        for (const p of pages) {
          const ig = p.instagram_business_account;
          if (ig && ig.media && Array.isArray(ig.media.data) && ig.media.data.length > 0) {
            posts = ig.media.data.map((item) => ({
              id: item.id,
              media_url: item.media_type === "VIDEO" ? item.thumbnail_url || item.media_url : item.media_url,
              permalink: item.permalink || "https://www.instagram.com/sumclothico/",
              caption: item.caption || "@sumclothico",
              timestamp: item.timestamp,
            }));
            break;
          }
        }
      }
    } else {
      // 2. Instagram Basic Display Token (starts with IGQ...)
      const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}&limit=6`;
      const res = await fetch(url, {
        next: { revalidate: 3600 },
      });

      if (res.ok) {
        const data = await res.json();
        posts = (data.data || []).map((item) => ({
          id: item.id,
          media_url: item.media_type === "VIDEO" ? item.thumbnail_url || item.media_url : item.media_url,
          permalink: item.permalink || "https://www.instagram.com/sumclothico/",
          caption: item.caption || "@sumclothico",
          timestamp: item.timestamp,
        }));
      }
    }

    if (posts.length > 0) {
      return NextResponse.json({
        isLive: true,
        posts,
      });
    }

    // No real posts available - return empty array (no dummy data)
    return NextResponse.json({
      isLive: false,
      posts: [],
    });
  } catch (error) {
    console.error("Failed to fetch live Instagram feed:", error);
    return NextResponse.json({
      isLive: false,
      posts: [],
    });
  }
}
