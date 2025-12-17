<template>
  <div class="edit-recipe-container">
    <!-- Loading State -->
    <div v-if="loadingRecipe" class="loading-state">
      <div class="spinner"></div>
      <p>Loading recipe...</p>
    </div>

    <!-- Main Content -->
    <div v-else-if="recipe" class="edit-recipe-wrapper">
      <!-- Header -->
      <div class="form-header">
        <h1 class="form-title">✏️ Edit Recipe</h1>
        <p class="form-subtitle">Update your recipe information</p>
      </div>

      <form @submit.prevent="handleSubmit" class="recipe-form">
        <!-- Title Section -->
        <div class="form-group">
          <label for="title" class="form-label">Recipe Title *</label>
          <input
            id="title"
            v-model="formData.title"
            type="text"
            placeholder="e.g., Chocolate Chip Cookies"
            required
            class="form-input"
          />
        </div>

        <!-- Description Section -->
        <div class="form-group">
          <label for="description" class="form-label">Description</label>
          <textarea
            id="description"
            v-model="formData.description"
            placeholder="Tell us about your recipe..."
            rows="4"
            class="form-textarea"
          ></textarea>
        </div>

        <!-- Ingredients Section -->
        <div class="form-group">
          <label class="form-label">📋 Ingredients *</label>
          <div class="ingredients-container">
            <div
              v-for="(ingredient, index) in formData.ingredients"
              :key="index"
              class="ingredient-row"
            >
              <input
                v-model="formData.ingredients[index]"
                type="text"
                placeholder="e.g., 2 cups flour"
                class="form-input ingredient-input"
                @input="
                  updateIngredient(
                    index,
                    ($event.target as HTMLInputElement).value
                  )
                "
              />
              <button
                type="button"
                @click="removeIngredient(index)"
                class="btn-remove"
              >
                ✕
              </button>
            </div>
            <button
              type="button"
              @click="addIngredient"
              class="btn-add-ingredient"
            >
              + Add Ingredient
            </button>
          </div>
        </div>

        <!-- Instructions Section -->
        <div class="form-group">
          <label for="instructions" class="form-label">👨‍🍳 Instructions *</label>
          <textarea
            id="instructions"
            v-model="formData.instructions"
            placeholder="Step by step instructions..."
            rows="6"
            required
            class="form-textarea"
          ></textarea>
        </div>

        <!-- Cooking Details Grid -->
        <div class="form-grid">
          <div class="form-group">
            <label for="cookingTime" class="form-label"
              >⏱️ Cooking Time (minutes) *</label
            >
            <input
              id="cookingTime"
              v-model.number="formData.cookingTime"
              type="number"
              placeholder="30"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="servings" class="form-label">🍽️ Servings *</label>
            <input
              id="servings"
              v-model.number="formData.servings"
              type="number"
              placeholder="4"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="difficulty" class="form-label">📊 Difficulty *</label>
            <select v-model="formData.difficulty" class="form-select" required>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div class="form-group">
            <label for="category" class="form-label">📁 Category</label>
            <input
              id="category"
              v-model="formData.category"
              type="text"
              placeholder="e.g., Dessert, Breakfast"
              class="form-input"
            />
          </div>
        </div>

        <!-- Image URL Section -->
        <div class="form-group">
          <label for="imageUrl" class="form-label">🖼️ Image URL</label>
          <input
            id="imageUrl"
            v-model="formData.imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            class="form-input"
          />
          <p class="form-hint">Enter a URL to an image of your recipe</p>
        </div>

        <!-- Public Checkbox -->
        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input
              v-model="formData.isPublic"
              type="checkbox"
              class="form-checkbox"
            />
            <span>Make this recipe public</span>
          </label>
          <p class="form-hint">Public recipes can be viewed by other users</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="error-message">
          <span>⚠️</span>
          {{ error }}
        </div>

        <!-- Submit Buttons -->
        <div class="form-actions">
          <NuxtLink :to="`/recipes/${recipeId}`" class="btn btn-cancel">
            Cancel
          </NuxtLink>
          <button type="submit" :disabled="loading" class="btn btn-submit">
            {{ loading ? "Updating..." : "✓ Update Recipe" }}
          </button>
        </div>
      </form>
    </div>

    <!-- Error State -->
    <div v-else-if="recipeError" class="error-state">
      <p>⚠️ {{ recipeError }}</p>
      <NuxtLink to="/recipes/my" class="back-link"
        >← Back to My Recipes</NuxtLink
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRecipeForm } from "~~/composables/useRecipeForm";
import { useRecipe } from "~~/composables/useRecipe";

definePageMeta({
  layout: "default",
  title: "Edit Recipe",
  description: "Edit your recipe",
});

const route = useRoute();
const router = useRouter();
const recipeId = route.params.id as string;

// Fetch the existing recipe - don't pass recipeId to prevent auto-loading
const {
  recipe,
  loading: loadingRecipe,
  error: recipeError,
  loadRecipe,
} = useRecipe();

// Initialize form with recipe data once loaded
const {
  formData,
  loading,
  error,
  addIngredient,
  removeIngredient,
  updateIngredient,
  submit,
} = useRecipeForm();

// Watch for recipe changes and populate form
watch(
  recipe,
  (newRecipe) => {
    if (newRecipe) {
      formData.value = {
        title: newRecipe.title,
        description: newRecipe.description || "",
        ingredients: [...newRecipe.ingredients],
        instructions: newRecipe.instructions,
        cookingTime: newRecipe.cookingTime,
        servings: newRecipe.servings,
        imageUrl: newRecipe.imageUrl || "",
        category: newRecipe.category || "",
        difficulty: newRecipe.difficulty as "easy" | "medium" | "hard",
        isPublic: newRecipe.isPublic,
      };
    }
  },
  { immediate: true }
);

// Load the recipe on mount
onMounted(async () => {
  await loadRecipe(recipeId);
});

const handleSubmit = async () => {
  try {
    const result = await submit(recipeId);
    if (result) {
      router.push(`/recipes/${recipeId}`);
    }
  } catch (e) {
    console.error("Failed to update recipe:", e);
  }
};
</script>

<style scoped>
.edit-recipe-container {
  min-height: calc(100vh - 200px);
  padding: 40px 0;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 20px;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-state p {
  color: #e74c3c;
  font-size: 18px;
}

.back-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}

.edit-recipe-wrapper {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-title {
  font-size: 32px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.form-subtitle {
  color: #666;
  font-size: 16px;
}

.recipe-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

.form-input,
.form-textarea,
.form-select {
  padding: 12px 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
}

.form-textarea {
  resize: vertical;
  font-family: inherit;
}

.ingredients-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ingredient-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.ingredient-input {
  flex: 1;
}

.btn-remove {
  padding: 8px 12px;
  background: #fee;
  color: #e74c3c;
  border: 1px solid #fcc;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-remove:hover {
  background: #fcc;
}

.btn-add-ingredient {
  padding: 10px 16px;
  background: #f0f0f0;
  border: 1px dashed #ccc;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #667eea;
  font-weight: 500;
  transition: all 0.3s;
}

.btn-add-ingredient:hover {
  background: #e8e8e8;
  border-color: #667eea;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.checkbox-group {
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 500;
}

.form-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.form-hint {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.error-message {
  padding: 12px 16px;
  background: #fee;
  color: #e74c3c;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 8px;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-cancel {
  background: #f0f0f0;
  color: #666;
}

.btn-cancel:hover {
  background: #e0e0e0;
}

.btn-submit {
  background: #667eea;
  color: white;
}

.btn-submit:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .edit-recipe-wrapper {
    padding: 24px;
  }

  .form-title {
    font-size: 24px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
}
</style>
