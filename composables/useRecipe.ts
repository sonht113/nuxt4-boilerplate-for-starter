import type { Recipe } from "~/types";
import { useRecipes } from "./useRecipes";

export const useRecipe = (recipeId?: string) => {
  const { fetchRecipe, updateRecipe, deleteRecipe, patchRecipe } = useRecipes();

  const recipe = ref<Recipe | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const loadRecipe = async (id?: string) => {
    const targetId = id || recipeId;
    if (!targetId) {
      error.value = "Recipe ID is required";
      return;
    }

    loading.value = true;
    error.value = null;

    try {
      recipe.value = await fetchRecipe(targetId);
    } catch (e: any) {
      error.value = e.message;
    } finally {
      loading.value = false;
    }
  };

  const update = async (data: any) => {
    if (!recipe.value) return;

    loading.value = true;
    error.value = null;

    try {
      recipe.value = await updateRecipe(recipe.value.id, data);
      return recipe.value;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const patch = async (data: any) => {
    if (!recipe.value) return;

    loading.value = true;
    error.value = null;

    try {
      recipe.value = await patchRecipe(recipe.value.id, data);
      return recipe.value;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const remove = async () => {
    if (!recipe.value) return;

    loading.value = true;
    error.value = null;

    try {
      await deleteRecipe(recipe.value.id);
      recipe.value = null;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const refresh = () => {
    if (recipe.value) {
      loadRecipe(recipe.value.id);
    } else if (recipeId) {
      loadRecipe(recipeId);
    }
  };

  // Auto-load if recipeId is provided
  onMounted(() => {
    if (recipeId) {
      loadRecipe(recipeId);
    }
  });

  return {
    recipe,
    loading,
    error,
    loadRecipe,
    update,
    patch,
    remove,
    refresh,
  };
};
