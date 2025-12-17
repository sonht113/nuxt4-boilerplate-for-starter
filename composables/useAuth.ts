import type { User, AuthResponse } from "~/types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  name: string;
  password: string;
}

export const useAuth = () => {
  const accessToken = useState<string | null>("accessToken", () => null);
  const refreshToken = useState<string | null>("refreshToken", () => null);
  const user = useState<User | null>("user", () => null);
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value);

  // Login
  const login = async (credentials: LoginCredentials) => {
    try {
      const data = await $fetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: credentials,
      });

      accessToken.value = data.accessToken;
      refreshToken.value = data.refreshToken;
      user.value = data.user;

      // Store in localStorage for persistence
      if (process.client) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error: any) {
      throw new Error(error.data?.message || "Login failed");
    }
  };

  // Register
  const register = async (data: RegisterData) => {
    try {
      const response = await $fetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: data,
      });

      accessToken.value = response.accessToken;
      refreshToken.value = response.refreshToken;
      user.value = response.user;

      // Store in localStorage for persistence
      if (process.client) {
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error: any) {
      throw new Error(error.data?.message || "Registration failed");
    }
  };

  // Logout
  const logout = async () => {
    try {
      if (refreshToken.value && accessToken.value) {
        await $fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
          body: { refreshToken: refreshToken.value },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear state
      accessToken.value = null;
      refreshToken.value = null;
      user.value = null;

      // Clear localStorage
      if (process.client) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    }
  };

  // Refresh tokens
  const refresh = async () => {
    if (!refreshToken.value) {
      throw new Error("No refresh token available");
    }

    try {
      const data = await $fetch<AuthResponse>("/api/auth/refresh", {
        method: "POST",
        body: { refreshToken: refreshToken.value },
      });

      accessToken.value = data.accessToken;
      refreshToken.value = data.refreshToken;
      user.value = data.user;

      // Update localStorage
      if (process.client) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      return data;
    } catch (error: any) {
      // If refresh fails, logout
      await logout();
      throw new Error(error.data?.message || "Session expired");
    }
  };

  // Get current user
  const fetchMe = async () => {
    if (!accessToken.value) {
      throw new Error("Not authenticated");
    }

    try {
      const data = await $fetch<User>("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      });

      user.value = data;
      return data;
    } catch (error: any) {
      throw new Error(error.data?.message || "Failed to fetch user");
    }
  };

  // Initialize auth from localStorage
  const initAuth = () => {
    if (process.client) {
      const storedAccessToken = localStorage.getItem("accessToken");
      const storedRefreshToken = localStorage.getItem("refreshToken");
      const storedUser = localStorage.getItem("user");

      if (storedAccessToken && storedRefreshToken && storedUser) {
        accessToken.value = storedAccessToken;
        refreshToken.value = storedRefreshToken;
        user.value = JSON.parse(storedUser);
      }
    }
  };

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    login,
    register,
    logout,
    refresh,
    fetchMe,
    initAuth,
  };
};
