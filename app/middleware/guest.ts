export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server) return;

  const accessToken = localStorage.getItem("accessToken");

  // Guest-only routes (login, register)
  const guestRoutes = ["/login", "/register"];

  // If authenticated user tries to access guest routes, redirect to home
  if (guestRoutes.includes(to.path) && accessToken) {
    return navigateTo("/");
  }
});
