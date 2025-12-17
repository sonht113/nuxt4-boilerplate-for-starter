<template>
  <div class="create-recipe-container">
    <div class="create-recipe-wrapper">
      <!-- Header -->
      <div class="form-header">
        <h1 class="form-title">🍳 Create Your Recipe</h1>
        <p class="form-subtitle">Share your delicious recipe with the world</p>
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

        <!-- Submit Button -->
        <div class="form-actions">
          <button type="submit" :disabled="loading" class="btn btn-submit">
            {{ loading ? "Creating..." : "✓ Create Recipe" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRecipeForm } from "~~/composables/useRecipeForm";

definePageMeta({
  layout: "default",
  title: "Create Recipe",
  description: "Create a new recipe to share with others",
});

const router = useRouter();
const {
  formData,
  loading,
  error,
  addIngredient,
  removeIngredient,
  updateIngredient,
  submit,
} = useRecipeForm();

const handleSubmit = async () => {
  try {
    const recipe = await submit();
    if (recipe) {
      router.push(`/recipes/${recipe.id}`);
    }
  } catch (e) {
    // Error is handled in composable
  }
};
</script>

<style scoped>
.create-recipe-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.create-recipe-wrapper {
  max-width: 800px;
  margin: 0 auto;
  animation: fadeInUp 0.6s ease;
}

.form-header {
  text-align: center;
  color: white;
  margin-bottom: 40px;
}

.form-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 10px;
}

.form-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

.recipe-form {
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.form-group {
  margin-bottom: 25px;
}

.form-label {
  display: block;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 12px 16px;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-family: inherit;
  transition: all 0.3s;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-textarea {
  resize: vertical;
}

.form-hint {
  font-size: 0.85rem;
  color: #999;
  margin-top: 6px;
  margin-bottom: 0;
}

/* Ingredients Container */
.ingredients-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ingredient-row {
  display: flex;
  gap: 10px;
  align-items: center;
}

.ingredient-input {
  flex: 1;
}

.btn-remove {
  padding: 10px 15px;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-remove:hover {
  background: #d32f2f;
  transform: scale(1.05);
}

.btn-add-ingredient {
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 8px;
}

.btn-add-ingredient:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}

/* Checkbox */
.checkbox-group {
  margin-top: 30px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-weight: 500;
  color: #333;
}

.form-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

/* Error Message */
.error-message {
  padding: 15px 20px;
  background: #ffebee;
  border: 2px solid #f44336;
  border-radius: 10px;
  color: #c62828;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 25px;
}

/* Form Actions */
.form-actions {
  margin-top: 35px;
  display: flex;
  gap: 15px;
}

.btn {
  padding: 14px 28px;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-submit {
  flex: 1;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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
