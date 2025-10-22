import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);

const isAdminRoute = createRouteMatcher(["/upload"]);

export default clerkMiddleware(async (auth, request) => {
	const { sessionClaims } = await auth();
	const isAdmin = sessionClaims?.metadata?.role === "admin";

	if (isAdminRoute(request) && !isAdmin) {
		const homeUrl = new URL("/", request.url);
		return NextResponse.redirect(homeUrl);
	}

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
