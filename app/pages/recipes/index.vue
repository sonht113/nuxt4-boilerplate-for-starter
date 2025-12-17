<template>
  <div class="recipes-container">
    <header class="recipes-header">
      <h1>Discover Recipes</h1>
      <p class="subtitle">Find delicious recipes tailored to your taste</p>
    </header>

    <!-- Search and Filters -->
    <div class="filters-section">
      <div class="search-box">
        <input
          v-model="searchQuery"
          @input="handleSearch"
          placeholder="🔍 Search recipes..."
          class="search-input"
        />
      </div>

      <div class="filter-controls">
        <select @change="handleCategoryChange" class="filter-select">
          <option value="">📁 All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>

        <select @change="handleDifficultyChange" class="filter-select">
          <option value="">📊 All Difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading delicious recipes...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="error-state">
      <p>⚠️ {{ error }}</p>
    </div>

    <!-- Recipe List -->
    <div v-else class="recipe-grid">
      <div v-for="recipe in recipes" :key="recipe.id" class="recipe-card">
        <div class="recipe-image-wrapper">
          <img
            v-if="recipe.imageUrl"
            :src="recipe.imageUrl"
            :alt="recipe.title"
            class="recipe-image"
          />
          <div v-else class="recipe-image-placeholder">No Image</div>
          <span class="difficulty-badge" :class="recipe.difficulty">{{
            recipe.difficulty
          }}</span>
        </div>

        <div class="recipe-content">
          <h3 class="recipe-title">{{ recipe.title }}</h3>
          <p class="recipe-description">{{ recipe.description }}</p>

          <div class="recipe-meta">
            <span class="meta-item">⏱️ {{ recipe.cookingTime }}m</span>
            <span class="meta-item">🍽️ {{ recipe.servings }}</span>
          </div>

          <NuxtLink :to="`/recipes/${recipe.id}`" class="view-recipe-btn">
            View Recipe →
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button
        @click="setPage(pagination.page - 1)"
        :disabled="pagination.page === 1"
        class="pagination-btn"
      >
        ← Previous
      </button>
      <span class="pagination-info"
        >Page {{ pagination.page }} of {{ pagination.totalPages }}</span
      >
      <button
        @click="setPage(pagination.page + 1)"
        :disabled="pagination.page === pagination.totalPages"
        class="pagination-btn"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRecipeList } from "~~/composables/useRecipeList";
import { useRecipeCategories } from "~~/composables/useRecipeCategories";
import { useDebounceFn } from "@vueuse/core";

definePageMeta({
  layout: "default",
  title: "Discover Recipes",
  description: "Find delicious recipes tailored to your taste",
});

const {
  recipes,
  loading,
  error,
  pagination,
  setPage,
  setSearch,
  setCategory,
  setDifficulty,
} = useRecipeList();

const { categories } = useRecipeCategories();

const searchQuery = ref("");

const handleSearch = useDebounceFn(() => {
  setSearch(searchQuery.value);
}, 500);

const handleCategoryChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value;
  setCategory(value || undefined);
};

const handleDifficultyChange = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value;
  setDifficulty((value as any) || undefined);
};
</script>

<style scoped>
.recipes-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.recipes-header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
  animation: fadeInDown 0.6s ease;
}

.recipes-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 10px;
}

.subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
}

.filters-section {
  max-width: 1200px;
  margin: 0 auto 40px;
  background: white;
  padding: 25px;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.search-box {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
}

.filter-controls {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.filter-select {
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 0.95rem;
  cursor: pointer;
  transition: border-color 0.3s;
  background-color: white;
}

.filter-select:hover {
  border-color: #667eea;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

@media (max-width: 768px) {
  .filter-controls {
    grid-template-columns: 1fr;
  }
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
  color: white;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-state {
  max-width: 1200px;
  margin: 0 auto;
  padding: 25px;
  background: #ff6b6b;
  color: white;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.recipe-grid {
  max-width: 1200px;
  margin: 0 auto 40px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  animation: fadeInUp 0.6s ease;
}

.recipe-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  display: flex;
  flex-direction: column;
}

.recipe-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

.recipe-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #f0f0f0;
}

.recipe-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.recipe-card:hover .recipe-image {
  transform: scale(1.05);
}

.recipe-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #e0e0e0, #f5f5f5);
  color: #999;
  font-weight: 600;
}

.difficulty-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: capitalize;
  background: white;
  color: #333;
}

.difficulty-badge.easy {
  background: #4caf50;
  color: white;
}

.difficulty-badge.medium {
  background: #ff9800;
  color: white;
}

.difficulty-badge.hard {
  background: #f44336;
  color: white;
}

.recipe-content {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.recipe-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.recipe-description {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 15px;
  line-height: 1.5;
  flex-grow: 1;
}

.recipe-meta {
  display: flex;
  gap: 15px;
  margin-bottom: 15px;
  font-size: 0.9rem;
  color: #666;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.view-recipe-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 10px 15px;
  border-radius: 8px;
  text-decoration: none;
  text-align: center;
  font-weight: 600;
  transition: transform 0.2s, box-shadow 0.2s;
}

.view-recipe-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

.pagination {
  max-width: 1200px;
  margin: 40px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  color: white;
}

.pagination-btn {
  background: white;
  color: #667eea;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-weight: 600;
  min-width: 150px;
  text-align: center;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
