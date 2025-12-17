<template>
  <div class="recipe-detail-container">
    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading recipe...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>⚠️ {{ error }}</p>
      <NuxtLink to="/recipes" class="back-link">← Back to Recipes</NuxtLink>
    </div>

    <!-- Recipe Content -->
    <div v-else-if="recipe" class="recipe-detail">
      <!-- Back Button -->
      <NuxtLink to="/recipes" class="back-button">← Back to Recipes</NuxtLink>

      <!-- Hero Section -->
      <div class="recipe-hero">
        <img
          v-if="recipe.imageUrl"
          :src="recipe.imageUrl"
          :alt="recipe.title"
          class="recipe-hero-image"
        />
        <div v-else class="recipe-hero-placeholder">No Image Available</div>

        <div class="recipe-title-section">
          <h1 class="recipe-title">{{ recipe.title }}</h1>
          <p class="recipe-category" v-if="recipe.category">
            🏷️ {{ recipe.category }}
          </p>
        </div>
      </div>

      <!-- Meta Information -->
      <div class="recipe-meta-section">
        <div class="meta-item">
          <span class="meta-icon">⏱️</span>
          <div class="meta-content">
            <span class="meta-label">Cooking Time</span>
            <span class="meta-value">{{ recipe.cookingTime }} minutes</span>
          </div>
        </div>
        <div class="meta-item">
          <span class="meta-icon">🍽️</span>
          <div class="meta-content">
            <span class="meta-label">Servings</span>
            <span class="meta-value">{{ recipe.servings }}</span>
          </div>
        </div>
        <div class="meta-item">
          <span class="meta-icon">📊</span>
          <div class="meta-content">
            <span class="meta-label">Difficulty</span>
            <span class="meta-value difficulty" :class="recipe.difficulty">{{
              recipe.difficulty
            }}</span>
          </div>
        </div>
      </div>

      <!-- Description -->
      <div class="recipe-description-section">
        <p class="recipe-description">{{ recipe.description }}</p>
      </div>

      <!-- Content Grid -->
      <div class="recipe-content-grid">
        <!-- Ingredients Section -->
        <section class="ingredients-section">
          <h2 class="section-title">📋 Ingredients</h2>
          <ul class="ingredients-list">
            <li
              v-for="(ingredient, index) in recipe.ingredients"
              :key="index"
              class="ingredient-item"
            >
              <span class="ingredient-checkbox">✓</span>
              {{ ingredient }}
            </li>
          </ul>
        </section>

        <!-- Instructions Section -->
        <section class="instructions-section">
          <h2 class="section-title">👨‍🍳 Instructions</h2>
          <div class="instructions-content">
            <p class="instructions-text">{{ recipe.instructions }}</p>
          </div>
        </section>
      </div>

      <!-- Actions -->
      <div v-if="user && recipe.authorId === user.id" class="actions-section">
        <NuxtLink :to="`/recipes/edit/${recipe.id}`" class="btn btn-primary">
          ✏️ Edit Recipe
        </NuxtLink>
        <button @click="showDeleteModal = true" class="btn btn-danger">
          🗑️ Delete Recipe
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <CommonConfirmModal
      v-model="showDeleteModal"
      title="Delete Recipe"
      message="Are you sure you want to delete this recipe? This action cannot be undone."
      confirm-text="Delete"
      cancel-text="Cancel"
      type="danger"
      :loading="deleteLoading"
      @confirm="handleDeleteConfirm"
    />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "~~/composables/useAuth";
import { useRecipe } from "~~/composables/useRecipe";

definePageMeta({
  layout: "default",
  middleware: "guest",
  title: "Recipe Details",
  description: "View detailed information about the recipe",
});

const route = useRoute();
const router = useRouter();
const { user } = useAuth();
const { recipe, loading, error, remove } = useRecipe(route.params.id as string);

const showDeleteModal = ref(false);
const deleteLoading = ref(false);

const handleDeleteConfirm = async () => {
  deleteLoading.value = true;
  try {
    await remove();
    showDeleteModal.value = false;
    router.push("/recipes");
  } catch (e) {
    alert("Failed to delete recipe");
    deleteLoading.value = false;
  }
};
</script>

<style scoped>
.recipe-detail-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.loading-state,
.error-state {
  max-width: 1200px;
  margin: 60px auto;
  text-align: center;
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
  background: rgba(255, 107, 107, 0.9);
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.back-link {
  display: inline-block;
  color: white;
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.3s;
}

.back-link:hover {
  opacity: 0.8;
}

.recipe-detail {
  max-width: 1000px;
  margin: 0 auto;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: white;
  text-decoration: none;
  font-weight: 600;
  margin-bottom: 20px;
  transition: transform 0.3s;
}

.back-button:hover {
  transform: translateX(-5px);
}

/* Hero Section */
.recipe-hero {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  margin-bottom: 40px;
  animation: fadeInDown 0.6s ease;
}

.recipe-hero-image {
  width: 100%;
  height: 400px;
  object-fit: cover;
}

.recipe-hero-placeholder {
  width: 100%;
  height: 400px;
  background: linear-gradient(135deg, #e0e0e0, #f5f5f5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #999;
  font-size: 1.2rem;
  font-weight: 600;
}

.recipe-title-section {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.8));
  padding: 40px 30px 30px;
  color: white;
}

.recipe-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0;
  margin-bottom: 8px;
}

.recipe-category {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

/* Meta Section */
.recipe-meta-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
  animation: fadeInUp 0.6s ease;
}

.meta-item {
  background: white;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s;
}

.meta-item:hover {
  transform: translateY(-5px);
}

.meta-icon {
  font-size: 2rem;
}

.meta-content {
  display: flex;
  flex-direction: column;
}

.meta-label {
  font-size: 0.85rem;
  color: #999;
  text-transform: uppercase;
  font-weight: 600;
}

.meta-value {
  font-size: 1.2rem;
  color: #333;
  font-weight: 600;
}

.meta-value.difficulty {
  padding: 4px 12px;
  border-radius: 20px;
  color: white;
}

.meta-value.difficulty.easy {
  background: #4caf50;
}

.meta-value.difficulty.medium {
  background: #ff9800;
}

.meta-value.difficulty.hard {
  background: #f44336;
}

/* Description Section */
.recipe-description-section {
  background: white;
  padding: 30px;
  border-radius: 15px;
  margin-bottom: 40px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.recipe-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #555;
  margin: 0;
}

/* Content Grid */
.recipe-content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
  animation: fadeInUp 0.6s ease;
}

@media (max-width: 768px) {
  .recipe-content-grid {
    grid-template-columns: 1fr;
  }
}

.ingredients-section,
.instructions-section {
  background: white;
  padding: 30px;
  border-radius: 15px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 1.5rem;
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
  font-weight: 700;
}

/* Ingredients List */
.ingredients-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ingredient-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
  color: #555;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: color 0.3s;
}

.ingredient-item:last-child {
  border-bottom: none;
}

.ingredient-item:hover {
  color: #667eea;
}

.ingredient-checkbox {
  color: #4caf50;
  font-weight: 700;
}

/* Instructions */
.instructions-content {
  color: #555;
}

.instructions-text {
  line-height: 1.8;
  font-size: 1rem;
  margin: 0;
  white-space: pre-line;
}

/* Actions Section */
.actions-section {
  display: flex;
  gap: 15px;
  margin-bottom: 60px;
  animation: fadeInUp 0.6s ease;
}

@media (max-width: 768px) {
  .actions-section {
    flex-direction: column;
  }
}

.btn {
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.btn-danger {
  background: #f44336;
  color: white;
}

.btn-danger:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(244, 67, 54, 0.4);
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
