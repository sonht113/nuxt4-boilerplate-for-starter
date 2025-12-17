<script setup lang="ts">
import { useAuth } from "~~/composables/useAuth";

const router = useRouter();
const { isAuthenticated, user, logout } = useAuth();

const handleLogout = async () => {
  await logout();
  router.push("/login");
};
</script>

<template>
  <header class="app-header">
    <div class="section_container">
      <NuxtLink to="/" class="logo"> 🍳 Recipe App </NuxtLink>

      <nav class="nav">
        <NuxtLink to="/recipes">{{ $t("header.recipes") }}</NuxtLink>

        <template v-if="isAuthenticated">
          <NuxtLink to="/recipes/my">{{ $t("header.myRecipes") }}</NuxtLink>
          <NuxtLink to="/recipes/create">{{
            $t("header.createRecipe")
          }}</NuxtLink>
          <div class="user-menu">
            <span class="user-name">{{ user?.name }}</span>
            <button @click="handleLogout" class="logout-btn">
              {{ $t("header.logout") }}
            </button>
          </div>
        </template>

        <template v-else>
          <NuxtLink to="/login">{{ $t("header.login") }}</NuxtLink>
          <NuxtLink to="/register">{{ $t("header.register") }}</NuxtLink>
        </template>

        <CommonLanguageSwitcher />
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.app-header .section_container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  text-decoration: none;
  color: #667eea;
}

.nav {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav a {
  text-decoration: none;
  color: #666;
  font-weight: 500;
  transition: color 0.3s;
}

.nav a:hover,
.nav a.router-link-active {
  color: #667eea;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-name {
  color: #333;
  font-weight: 500;
}

.logout-btn {
  padding: 8px 16px;
  background: #f0f0f0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.logout-btn:hover {
  background: #e0e0e0;
}
</style>
