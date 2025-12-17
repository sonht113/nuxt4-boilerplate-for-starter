export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;

  const accessToken = localStorage.getItem("accessToken");

  // Protected routes that require authentication
  const protectedRoutes = ["/recipes/create", "/recipes/my"];

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    to.path.startsWith(route)
  );

  // If trying to access a protected route without a token, redirect to login
  if (isProtectedRoute && !accessToken) {
    return navigateTo("/login");
  }
});
