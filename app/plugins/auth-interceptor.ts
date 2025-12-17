export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();

  // Global error handler for unauthorized requests
  const handleUnauthorized = () => {
    // Clear auth data from localStorage
    if (process.client) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");

      // Show notification or message (optional)
      console.warn("Session expired. Please login again.");

      // Redirect to login page if not already there
      if (router.currentRoute.value.path !== "/login") {
        router.push({
          path: "/login",
          query: { redirect: router.currentRoute.value.fullPath },
        });
      }
    }
  };

  // Intercept all $fetch calls globally
  const $fetchInstance = $fetch.create({
    onResponseError({ response }) {
      // Handle 401 Unauthorized
      if (response.status === 401) {
        handleUnauthorized();
      }
    },
  });

  // Override the global $fetch with our intercepted version
  nuxtApp.provide("fetch", $fetchInstance);

  // Also handle errors from useFetch and other composables
  nuxtApp.hook("app:error", (error: any) => {
    if (error?.statusCode === 401 || error?.status === 401) {
      handleUnauthorized();
    }
  });
});
