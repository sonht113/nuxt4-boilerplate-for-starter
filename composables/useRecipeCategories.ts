import { useRecipes } from "./useRecipes";

export const useRecipeCategories = () => {
  const { fetchCategories } = useRecipes();

  const categories = ref<string[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadCategories = async () => {
    loading.value = true;
    error.value = null;

    try {
      const data = await fetchCategories();
      categories.value = data.categories;
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  onMounted(() => {
    loadCategories();
  });

  return {
    categories,
    loading,
    error,
    loadCategories,
  };
};
