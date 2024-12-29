import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/", "/api/generate-questions"]
});

export const config = {
  matcher: [
    "/(dashboard|resume|challenge|quiz|debugger)(.*)",
    "/api/((?!generate-questions).)*"
  ]
}; 