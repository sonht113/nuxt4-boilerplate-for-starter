import type { Recipe, PaginatedResponse } from "~/types";
import { useAuth } from "./useAuth";

interface RecipeFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
  authorId?: string;
}

interface CreateRecipeData {
  title: string;
  description?: string;
  ingredients: string[];
  instructions: string;
  cookingTime: number;
  servings: number;
  imageUrl?: string;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
  isPublic?: boolean;
}

interface UpdateRecipeData extends Partial<CreateRecipeData> {}

export const useRecipes = () => {
  const { accessToken } = useAuth();

  // Fetch all recipes with filters
  const fetchRecipes = async (filters: RecipeFilters = {}) => {
    const query = new URLSearchParams();

    if (filters.page) query.append("page", filters.page.toString());
    if (filters.limit) query.append("limit", filters.limit.toString());
    if (filters.search) query.append("search", filters.search);
    if (filters.category) query.append("category", filters.category);
    if (filters.difficulty) query.append("difficulty", filters.difficulty);
    if (filters.authorId) query.append("authorId", filters.authorId);

    const queryString = query.toString();
    const url = `/api/recipes${queryString ? `?${queryString}` : ""}`;

    return await $fetch<{
      recipes: Recipe[];
      pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
      };
    }>(url);
  };

  // Fetch single recipe by ID
  const fetchRecipe = async (id: string) => {
    try {
      return await $fetch<Recipe>(`/api/recipes/${id}`, {
        headers: accessToken.value
          ? {
              Authorization: `Bearer ${accessToken.value}`,
            }
          : {},
      });
    } catch (error: any) {
      throw new Error(error.data?.message || "Failed to fetch recipe");
    }
  };

  // Create new recipe
  const createRecipe = async (data: CreateRecipeData) => {
    if (!accessToken.value) {
      throw new Error("Authentication required");
    }

    try {
      return await $fetch<Recipe>("/api/recipes", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
        body: data,
      });
    } catch (error: any) {
      throw new Error(error.data?.message || "Failed to create recipe");
    }
  };

  // Update recipe (full update)
  const updateRecipe = async (id: string, data: UpdateRecipeData) => {
    if (!accessToken.value) {
      throw new Error("Authentication required");
    }

    try {
      return await $fetch<Recipe>(`/api/recipes/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
        body: data,
      });
    } catch (error: any) {
      throw new Error(error.data?.message || "Failed to update recipe");
    }
  };

  // Patch recipe (partial update)
  const patchRecipe = async (id: string, data: Partial<UpdateRecipeData>) => {
    if (!accessToken.value) {
      throw new Error("Authentication required");
    }

    try {
      return await $fetch<Recipe>(`/api/recipes/${id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
        body: data,
      });
    } catch (error: any) {
      throw new Error(error.data?.message || "Failed to patch recipe");
    }
  };

  // Delete recipe
  const deleteRecipe = async (id: string) => {
    if (!accessToken.value) {
      throw new Error("Authentication required");
    }

    try {
      return await $fetch<{ message: string }>(`/api/recipes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      });
    } catch (error: any) {
      throw new Error(error.data?.message || "Failed to delete recipe");
    }
  };

  // Fetch my recipes
  const fetchMyRecipes = async (
    page = 1,
    limit = 10,
    includePrivate = true
  ) => {
    if (!accessToken.value) {
      throw new Error("Authentication required");
    }

    try {
      return await $fetch<{
        recipes: Recipe[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      }>(
        `/api/recipes/my? page=${page}&limit=${limit}&includePrivate=${includePrivate}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
          },
        }
      );
    } catch (error: any) {
      throw new Error(error.data?.message || "Failed to fetch your recipes");
    }
  };

  // Fetch recipe categories
  const fetchCategories = async () => {
    try {
      return await $fetch<{ categories: string[] }>("/api/recipes/categories");
    } catch (error: any) {
      throw new Error(error.data?.message || "Failed to fetch categories");
    }
  };

  // Fetch recipe stats
  const fetchStats = async () => {
    if (!accessToken.value) {
      throw new Error("Authentication required");
    }

    try {
      return await $fetch<{
        totalRecipes: number;
        publicRecipes: number;
        privateRecipes: number;
      }>("/api/recipes/stats", {
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      });
    } catch (error: any) {
      throw new Error(error.data?.message || "Failed to fetch stats");
    }
  };

  return {
    fetchRecipes,
    fetchRecipe,
    createRecipe,
    updateRecipe,
    patchRecipe,
    deleteRecipe,
    fetchMyRecipes,
    fetchCategories,
    fetchStats,
  };
};
