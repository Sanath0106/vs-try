import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/"]
});

export const config = {
  matcher: [
    "/(dashboard|resume|challenge|quiz)(.*)",
    "/api/(.*)"
  ]
}; 