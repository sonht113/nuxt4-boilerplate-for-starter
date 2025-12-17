import { useRecipe } from './useRecipe';
import { useRecipes } from "./useRecipes";

interface RecipeFormData {
  title: string;
  description: string;
  ingredients: string[];
  instructions: string;
  cookingTime: number;
  servings: number;
  imageUrl: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  isPublic: boolean;
}

export const useRecipeForm = (initialData?: Partial<RecipeFormData>) => {
  const { createRecipe, updateRecipe } = useRecipes();

  const formData = ref<RecipeFormData>({
    title: "",
    description: "",
    ingredients: [""],
    instructions: "",
    cookingTime: 30,
    servings: 4,
    imageUrl: "",
    category: "",
    difficulty: "medium",
    isPublic: true,
    ...initialData,
  });

  const loading = ref(false);
  const error = ref<string | null>(null);

  const addIngredient = () => {
    formData.value.ingredients.push("");
  };

  const removeIngredient = (index: number) => {
    if (formData.value.ingredients.length > 1) {
      formData.value.ingredients.splice(index, 1);
    }
  };

  const updateIngredient = (index: number, value: string) => {
    formData.value.ingredients[index] = value;
  };

  const validate = () => {
    const errors: string[] = [];

    if (!formData.value.title || formData.value.title.length < 3) {
      errors.push("Title must be at least 3 characters");
    }

    const validIngredients = formData.value.ingredients.filter((i) => i.trim());
    if (validIngredients.length === 0) {
      errors.push("At least one ingredient is required");
    }

    if (
      !formData.value.instructions ||
      formData.value.instructions.length < 10
    ) {
      errors.push("Instructions must be at least 10 characters");
    }

    if (formData.value.cookingTime <= 0) {
      errors.push("Cooking time must be positive");
    }

    if (formData.value.servings <= 0) {
      errors.push("Servings must be positive");
    }

    return errors;
  };

  const submit = async (recipeId?: string) => {
    error.value = null;
    const validationErrors = validate();

    if (validationErrors.length > 0) {
      error.value = validationErrors.join(", ");
      return null;
    }

    loading.value = true;

    try {
      // Filter out empty ingredients
      const cleanedData = {
        ...formData.value,
        ingredients: formData.value.ingredients.filter((i) => i.trim()),
      };

      let result;
      if (recipeId) {
        result = await updateRecipe(recipeId, cleanedData);
      } else {
        result = await createRecipe(cleanedData);
      }

      return result;
    } catch (e: any) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  const reset = () => {
    formData.value = {
      title: "",
      description: "",
      ingredients: [""],
      instructions: "",
      cookingTime: 30,
      servings: 4,
      imageUrl: "",
      category: "",
      difficulty: "medium",
      isPublic: true,
    };
    error.value = null;
  };

  return {
    formData,
    loading,
    error,
    addIngredient,
    removeIngredient,
    updateIngredient,
    validate,
    submit,
    reset,
  };
};
