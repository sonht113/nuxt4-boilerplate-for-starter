import type { Recipe } from "~/types";
import { useRecipes } from "./useRecipes";

interface RecipeFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
  authorId?: string;
}

export const useRecipeList = (initialFilters: RecipeFilters = {}) => {
  const { fetchRecipes } = useRecipes();

  const recipes = ref<Recipe[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const filters = ref<RecipeFilters>({
    page: 1,
    limit: 10,
    ...initialFilters,
  });

  const loadRecipes = async () => {
    loading.value = true;
    error.value = null;

    try {
      const data = await fetchRecipes(filters.value);
      recipes.value = data.recipes;
      pagination.value = data.pagination;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const setPage = (page: number) => {
    filters.value.page = page;
    loadRecipes();
  };

  const setSearch = (search: string) => {
    filters.value.search = search;
    filters.value.page = 1;
    loadRecipes();
  };

  const setCategory = (category: string | undefined) => {
    filters.value.category = category;
    filters.value.page = 1;
    loadRecipes();
  };

  const setDifficulty = (
    difficulty: "easy" | "medium" | "hard" | undefined
  ) => {
    filters.value.difficulty = difficulty;
    filters.value.page = 1;
    loadRecipes();
  };

  const resetFilters = () => {
    filters.value = {
      page: 1,
      limit: 10,
    };
    loadRecipes();
  };

  const refresh = () => {
    loadRecipes();
  };

  // Auto-load on mount
  onMounted(() => {
    loadRecipes();
  });

  return {
    recipes,
    loading,
    error,
    pagination,
    filters,
    loadRecipes,
    setPage,
    setSearch,
    setCategory,
    setDifficulty,
    resetFilters,
    refresh,
  };
};
