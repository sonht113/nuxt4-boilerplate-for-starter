import type { Recipe } from "~/types";
import { useRecipes } from "./useRecipes";

export const useMyRecipes = () => {
  const { fetchMyRecipes, fetchStats } = useRecipes();

  const myRecipes = ref<Recipe[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const pagination = ref({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const stats = ref({
    totalRecipes: 0,
    publicRecipes: 0,
    privateRecipes: 0,
  });

  const page = ref(1);
  const limit = ref(10);
  const includePrivate = ref(true);

  const loadMyRecipes = async () => {
    loading.value = true;
    error.value = null;

    try {
      const data = await fetchMyRecipes(
        page.value,
        limit.value,
        includePrivate.value
      );
      myRecipes.value = data.recipes;
      pagination.value = data.pagination;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const loadStats = async () => {
    try {
      stats.value = await fetchStats();
    } catch (e: any) {
      console.error("Failed to load stats:", e.message);
    }
  };

  const setPage = (newPage: number) => {
    page.value = newPage;
    loadMyRecipes();
  };

  const togglePrivate = () => {
    includePrivate.value = !includePrivate.value;
    page.value = 1;
    loadMyRecipes();
  };

  const refresh = () => {
    loadMyRecipes();
    loadStats();
  };

  onMounted(() => {
    loadMyRecipes();
    loadStats();
  });

  return {
    myRecipes,
    loading,
    error,
    pagination,
    stats,
    page,
    includePrivate,
    loadMyRecipes,
    loadStats,
    setPage,
    togglePrivate,
    refresh,
  };
};
