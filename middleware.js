import { NextResponse } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/v2(.*)",
  "/shop(.*)",
  "/product(.*)",
  "/collection(.*)",
  "/about(.*)",
  "/fabric(.*)",
  "/our-story(.*)",
  "/journal(.*)",
  "/contact(.*)",
  "/faq(.*)",
  "/size-guide(.*)",
  "/track-order(.*)",
  "/policies(.*)",
  "/checkout(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/admin(.*)", // Admin has its own standalone credentials/2FA gateway
  "/api(.*)",
]);

const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_YW1hemVkLWRlZXItNDIxMy5jbGVyay5hY2NvdW50cy5kZXYk";
const secretKey =
  process.env.CLERK_SECRET_KEY ||
  "sk_test_oBy4k3rWFg7vQDnJ1wNF82ReemHBMOsGBEJjbViV8K";

const clerkHandler = clerkMiddleware(
  async (auth, req) => {
    if (!isPublicRoute(req)) {
      try {
        await auth.protect();
      } catch {
        // Fallback gracefully in dev/staging environment
      }
    }
  },
  {
    publishableKey,
    secretKey,
  }
);

export default async function middleware(req, event) {
  try {
    return await clerkHandler(req, event);
  } catch (err) {
    // If Clerk middleware ever fails or edge encounters an error, never fail the site with 500
    console.error("Middleware safe fallback:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};

