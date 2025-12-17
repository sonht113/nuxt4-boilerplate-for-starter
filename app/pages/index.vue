<template>
  <div class="home-page">
    <div class="hero">
      <div>
        <h1 class="text-red-700">{{ $t("home.welcome") }}</h1>
        <p>{{ $t("home.description") }}</p>
        <div class="cta-buttons">
          <NuxtLink to="/recipes" class="btn btn-primary">{{
            $t("home.recipes")
          }}</NuxtLink>
          <NuxtLink
            v-if="!isAuthenticated"
            to="/register"
            class="btn btn-secondary"
            >{{ $t("home.createRecipe") }}</NuxtLink
          >
          <NuxtLink v-else to="/recipes/create" class="btn btn-secondary">{{
            $t("home.createRecipe")
          }}</NuxtLink>
        </div>
      </div>
    </div>

    <div class="features">
      <div class="feature-card">
        <div class="icon">🔍</div>
        <h3>{{ $t("home.discover") }}</h3>
        <p>{{ $t("home.discoverDescription") }}</p>
      </div>
      <div class="feature-card">
        <div class="icon">✨</div>
        <h3>{{ $t("home.createAndShare") }}</h3>
        <p>{{ $t("home.createAndShareDescription") }}</p>
      </div>
      <div class="feature-card">
        <div class="icon">❤️</div>
        <h3>{{ $t("home.save") }}</h3>
        <p>{{ $t("home.saveDescription") }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "~~/composables/useAuth";

definePageMeta({
  layout: "default",
  title: "Home",
  description: "Welcome to the Recipe App, discover and share amazing recipes",
});

const { isAuthenticated } = useAuth();
</script>

<style scoped>
.home-page {
  min-height: calc(100vh - 200px);
}

.hero {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 100px 20px;
  text-align: center;
}

.hero h1 {
  font-size: 48px;
  margin-bottom: 20px;
}

.hero p {
  font-size: 20px;
  margin-bottom: 40px;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}

.btn {
  padding: 14px 32px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary {
  background: white;
  color: #667eea;
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid white;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  padding: 80px 20px;
}

.feature-card {
  text-align: center;
  padding: 30px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.feature-card h3 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.feature-card p {
  color: #666;
  line-height: 1.6;
}
</style>
