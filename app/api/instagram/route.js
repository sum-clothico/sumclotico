import { NextResponse } from "next/server";

// Fallback high-resolution authentic Sum Clothico Khadi community posts
const FALLBACK_INSTAGRAM_POSTS = [
  {
    id: "sum-ig-1",
    media_url: "/assets/img/15.png",
    permalink: "https://www.instagram.com/sumclothico/",
    caption: "Mornings in handspun Khadi — easy, weightless, grounded. #SumClothico #SlowFashion",
    timestamp: "2026-10-28T09:00:00Z",
  },
  {
    id: "sum-ig-2",
    media_url: "/assets/img/14.png",
    permalink: "https://www.instagram.com/sumclothico/",
    caption: "Natural Khadi texture that softens and relaxes with every gentle wash. #HandspunCotton",
    timestamp: "2026-10-25T11:30:00Z",
  },
  {
    id: "sum-ig-3",
    media_url: "/assets/img/24.png",
    permalink: "https://www.instagram.com/sumclothico/",
    caption: "From busy desk hours to slow coffee afternoons. Made for real days. #EverydayKhadi",
    timestamp: "2026-10-22T14:15:00Z",
  },
  {
    id: "sum-ig-4",
    media_url: "/assets/img/26.png",
    permalink: "https://www.instagram.com/sumclothico/",
    caption: "Room to move, breathe, and simply be yourself in quiet handwoven silhouettes.",
    timestamp: "2026-10-19T16:45:00Z",
  },
];

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;

  if (!token) {
    return NextResponse.json({
      isLive: false,
      message: "Configure INSTAGRAM_ACCESS_TOKEN in .env.local to sync live Instagram Graph API feed.",
      posts: FALLBACK_INSTAGRAM_POSTS,
    });
  }

  try {
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${token}&limit=6`;
    const res = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour to respect Meta API rate limits
    });

    if (!res.ok) {
      console.warn("Instagram API responded with status:", res.status);
      return NextResponse.json({
        isLive: false,
        posts: FALLBACK_INSTAGRAM_POSTS,
      });
    }

    const data = await res.json();
    const posts = (data.data || []).map((item) => ({
      id: item.id,
      media_url: item.media_type === "VIDEO" ? item.thumbnail_url || item.media_url : item.media_url,
      permalink: item.permalink || "https://www.instagram.com/sumclothico/",
      caption: item.caption || "@sumclothico handwoven beginnings.",
      timestamp: item.timestamp,
    }));

    return NextResponse.json({
      isLive: true,
      posts: posts.length > 0 ? posts : FALLBACK_INSTAGRAM_POSTS,
    });
  } catch (error) {
    console.error("Failed to fetch live Instagram feed:", error);
    return NextResponse.json({
      isLive: false,
      posts: FALLBACK_INSTAGRAM_POSTS,
    });
  }
}

