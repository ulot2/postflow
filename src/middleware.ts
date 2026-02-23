import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { userId, sessionClaims } = await auth();
  console.log("Session claims:", sessionClaims);

  // If user is logged in, check if they need onboarding
  if (userId) {
    // We assume you sync hasCompletedOnboarding to Clerk publicMetadata
    // Alternatively, we can redirect unconditionally until they are flagged as onboarded
    const hasCompletedOnboarding = (
      sessionClaims?.metadata as Record<string, unknown>
    )?.hasCompletedOnboarding;
    const isOnboardingRoute =
      request.nextUrl.pathname.startsWith("/onboarding");

    // If they haven't onboarded and aren't on the onboarding page -> redirect to onboarding
    if (!hasCompletedOnboarding && !isOnboardingRoute) {
      const onboardingUrl = new URL("/onboarding", request.url);
      return Response.redirect(onboardingUrl);
    }

    // If they have onboarded and try to access onboarding page -> redirect to dashboard
    if (hasCompletedOnboarding && isOnboardingRoute) {
      const dashboardUrl = new URL("/dashboard", request.url);
      return Response.redirect(dashboardUrl);
    }
  }

  // Protect non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect();
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
