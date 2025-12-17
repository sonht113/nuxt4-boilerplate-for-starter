<template>
  <div class="my-recipes-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <div class="header-content">
          <h1 class="page-title">🍳 My Recipes</h1>
          <p class="page-subtitle">Manage your personal recipe collection</p>
        </div>
        <NuxtLink to="/recipes/create" class="btn-create-recipe">
          ➕ Create New Recipe
        </NuxtLink>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📚</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.totalRecipes }}</div>
            <div class="stat-label">Total Recipes</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🌍</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.publicRecipes }}</div>
            <div class="stat-label">Public Recipes</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔒</div>
          <div class="stat-info">
            <div class="stat-value">{{ stats.privateRecipes }}</div>
            <div class="stat-label">Private Recipes</div>
          </div>
        </div>
      </div>

      <!-- Filters Section -->
      <div class="filters-section">
        <div class="filter-left">
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="includePrivate"
              @change="togglePrivate"
              class="filter-checkbox"
            />
            <span>Show private recipes</span>
          </label>
        </div>
        <button @click="refresh" class="btn-refresh">🔄 Refresh</button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading your recipes...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="error-state">
        <span>⚠️</span>
        {{ error }}
      </div>

      <!-- Empty State -->
      <div v-else-if="!loading && myRecipes.length === 0" class="empty-state">
        <div class="empty-icon">🍳</div>
        <h2>No recipes yet</h2>
        <p>Start creating your first delicious recipe!</p>
        <NuxtLink to="/recipes/create" class="btn-create-large">
          Create Your First Recipe
        </NuxtLink>
      </div>

      <!-- Recipes List -->
      <div v-else class="recipes-list">
        <div
          v-for="recipe in myRecipes"
          :key="recipe.id"
          class="recipe-list-item"
        >
          <!-- Recipe Image -->
          <div class="recipe-list-image">
            <img
              v-if="recipe.imageUrl"
              :src="recipe.imageUrl"
              :alt="recipe.title"
              class="recipe-img"
            />
            <div v-else class="recipe-img-placeholder">🍽️</div>
          </div>

          <!-- Recipe Info -->
          <div class="recipe-list-info">
            <div class="recipe-header">
              <h3 class="recipe-title">{{ recipe.title }}</h3>
              <div class="recipe-badges">
                <span v-if="recipe.isPublic" class="badge badge-public"
                  >🌍 Public</span
                >
                <span v-else class="badge badge-private">🔒 Private</span>
              </div>
            </div>

            <p v-if="recipe.description" class="recipe-desc">
              {{ recipe.description }}
            </p>

            <div class="recipe-meta">
              <span class="meta-item">⏱️ {{ recipe.cookingTime }} min</span>
              <span class="meta-item">🍽️ {{ recipe.servings }} servings</span>
              <span
                v-if="recipe.difficulty"
                class="meta-item difficulty"
                :class="`difficulty-${recipe.difficulty}`"
              >
                📊 {{ recipe.difficulty }}
              </span>
              <span v-if="recipe.category" class="meta-item category">
                🏷️ {{ recipe.category }}
              </span>
            </div>
          </div>

          <!-- Recipe Actions -->
          <div class="recipe-actions">
            <NuxtLink
              :to="`/recipes/${recipe.id}`"
              class="action-btn btn-view"
              title="View Recipe"
            >
              👁️
            </NuxtLink>
            <NuxtLink
              :to="`/recipes/${recipe.id}/edit`"
              class="action-btn btn-edit"
              title="Edit Recipe"
            >
              ✏️
            </NuxtLink>
            <button
              @click="handleDelete(recipe.id, recipe.title)"
              class="action-btn btn-delete"
              title="Delete Recipe"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination.totalPages > 1" class="pagination-container">
        <button
          @click="setPage(pagination.page - 1)"
          :disabled="pagination.page === 1"
          class="pagination-btn"
        >
          ← Previous
        </button>

        <div class="page-numbers">
          <button
            v-for="pageNum in visiblePages"
            :key="pageNum"
            @click="setPage(pageNum)"
            :class="['page-number', { active: pageNum === pagination.page }]"
          >
            {{ pageNum === -1 ? "..." : pageNum }}
          </button>
        </div>

        <button
          @click="setPage(pagination.page + 1)"
          :disabled="pagination.page >= pagination.totalPages"
          class="pagination-btn"
        >
          Next →
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="cancelDelete">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Delete Recipe</h3>
          <button class="modal-close" @click="cancelDelete">✕</button>
        </div>
        <p class="modal-text">
          Are you sure you want to delete
          <strong>"{{ recipeToDelete.title }}"</strong>?
        </p>
        <p class="modal-warning">This action cannot be undone.</p>
        <div class="modal-actions">
          <button @click="cancelDelete" class="btn-modal-cancel">Cancel</button>
          <button
            @click="confirmDelete"
            class="btn-modal-delete"
            :disabled="deleting"
          >
            {{ deleting ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useMyRecipes } from "~~/composables/useMyRecipes";
import { useRecipes } from "~~/composables/useRecipes";
import { useAuth } from "~~/composables/useAuth";

definePageMeta({
  layout: "default",
  title: "My Recipes",
  description: "Manage your personal collection of recipes",
});

const { isAuthenticated } = useAuth();
const router = useRouter();

onMounted(() => {
  if (!isAuthenticated.value) {
    router.push("/login");
  }
});

const {
  myRecipes,
  loading,
  error,
  pagination,
  stats,
  includePrivate,
  setPage,
  togglePrivate,
  refresh,
} = useMyRecipes();

const { deleteRecipe } = useRecipes();
const showDeleteModal = ref(false);
const recipeToDelete = ref({ id: "", title: "" });
const deleting = ref(false);

const handleDelete = (id: string, title: string) => {
  recipeToDelete.value = { id, title };
  showDeleteModal.value = true;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  recipeToDelete.value = { id: "", title: "" };
};

const confirmDelete = async () => {
  deleting.value = true;
  try {
    await deleteRecipe(recipeToDelete.value.id);
    showDeleteModal.value = false;
    recipeToDelete.value = { id: "", title: "" };
    refresh();
  } catch (e: any) {
    alert("Failed to delete recipe: " + e.message);
  } finally {
    deleting.value = false;
  }
};

const visiblePages = computed(() => {
  const total = pagination.value.totalPages;
  const current = pagination.value.page;
  const pages: number[] = [];

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i);
      pages.push(-1);
      pages.push(total);
    } else if (current >= total - 3) {
      pages.push(1);
      pages.push(-1);
      for (let i = total - 4; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push(-1);
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push(-1);
      pages.push(total);
    }
  }

  return pages;
});
</script>

<style scoped>
.my-recipes-page {
  min-height: calc(100vh - 200px);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 0;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-content {
  flex: 1;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #333;
  margin: 0 0 5px 0;
}

.page-subtitle {
  color: #666;
  font-size: 1rem;
  margin: 0;
}

.btn-create-recipe {
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s;
  display: inline-block;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-create-recipe:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 15px;
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  font-size: 40px;
  line-height: 1;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  line-height: 1;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 13px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
}

/* Filters Section */
.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding: 15px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.filter-left {
  display: flex;
  align-items: center;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.filter-checkbox {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.btn-refresh {
  padding: 8px 16px;
  background: #f0f0f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #333;
  transition: all 0.3s;
}

.btn-refresh:hover {
  background: #e0e0e0;
  transform: scale(1.05);
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 80px 20px;
  color: #666;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(102, 126, 234, 0.2);
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Error State */
.error-state {
  background: #ffebee;
  color: #c62828;
  padding: 15px 20px;
  border-radius: 10px;
  border-left: 4px solid #c62828;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 500;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 20px;
  display: block;
}

.empty-state h2 {
  font-size: 28px;
  color: #333;
  margin: 0 0 10px 0;
}

.empty-state p {
  color: #666;
  font-size: 16px;
  margin: 0 0 30px 0;
}

.btn-create-large {
  display: inline-block;
  padding: 12px 32px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.btn-create-large:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

/* Recipes List */
.recipes-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 40px;
}

.recipe-list-item {
  display: flex;
  gap: 20px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.recipe-list-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

/* Recipe Image */
.recipe-list-image {
  flex-shrink: 0;
  width: 180px;
  height: 180px;
  overflow: hidden;
}

.recipe-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.recipe-list-item:hover .recipe-img {
  transform: scale(1.1);
}

.recipe-img-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 60px;
  color: white;
}

/* Recipe Info */
.recipe-list-info {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.recipe-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 15px;
  margin-bottom: 10px;
}

.recipe-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.recipe-badges {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.badge-public {
  background: #e3f2fd;
  color: #1976d2;
}

.badge-private {
  background: #f3e5f5;
  color: #7b1fa2;
}

.recipe-desc {
  color: #666;
  font-size: 14px;
  margin: 0 0 15px 0;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recipe-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 13px;
  color: #666;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-weight: 500;
}

.difficulty {
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 600;
}

.difficulty-easy {
  background: #e8f5e9;
  color: #2e7d32;
}

.difficulty-medium {
  background: #fff3e0;
  color: #e65100;
}

.difficulty-hard {
  background: #ffebee;
  color: #c62828;
}

.category {
  background: #f3e5f5;
  color: #7b1fa2;
  padding: 4px 10px;
  border-radius: 6px;
}

/* Recipe Actions */
.recipe-actions {
  display: flex;
  gap: 8px;
  padding: 15px 20px 0 0;
  align-self: flex-start;
}

.action-btn {
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
}

.btn-view {
  background: #e3f2fd;
  color: #1976d2;
}

.btn-view:hover {
  background: #1976d2;
  color: white;
}

.btn-edit {
  background: #fff3e0;
  color: #e65100;
}

.btn-edit:hover {
  background: #e65100;
  color: white;
}

.btn-delete {
  background: #ffebee;
  color: #c62828;
}

.btn-delete:hover {
  background: #c62828;
  color: white;
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 40px;
}

.pagination-btn {
  padding: 10px 20px;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background: #667eea;
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 5px;
}

.page-number {
  padding: 8px 12px;
  background: white;
  color: #667eea;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  min-width: 40px;
}

.page-number:hover {
  border-color: #667eea;
}

.page-number.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Delete Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.modal-header h3 {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s;
}

.modal-close:hover {
  color: #333;
}

.modal-text {
  margin: 0 0 10px 0;
  color: #666;
  line-height: 1.6;
}

.modal-warning {
  margin: 0 0 25px 0;
  color: #c62828;
  font-weight: 600;
  font-size: 14px;
}

.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.btn-modal-cancel,
.btn-modal-delete {
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-modal-cancel {
  background: #f0f0f0;
  color: #333;
}

.btn-modal-cancel:hover {
  background: #e0e0e0;
}

.btn-modal-delete {
  background: #c62828;
  color: white;
}

.btn-modal-delete:hover:not(:disabled) {
  background: #b71c1c;
}

.btn-modal-delete:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .btn-create-recipe {
    width: 100%;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .recipe-list-item {
    flex-direction: column;
  }

  .recipe-list-image {
    width: 100%;
    height: 200px;
  }

  .recipe-actions {
    padding: 0;
    justify-content: flex-start;
    margin-top: 10px;
  }

  .page-numbers {
    display: none;
  }
}
</style>
