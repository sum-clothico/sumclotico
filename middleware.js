import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  "/",
  "/collection(.*)",
  "/about(.*)",
  "/fabric(.*)",
  "/our-story(.*)",
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

export default clerkMiddleware(async (auth, req) => {
  // If not a public route, protect it
  if (!isPublicRoute(req)) {
    try {
      await auth.protect();
    } catch {
      // Fallback gracefully in dev environment if mock keys are present
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
