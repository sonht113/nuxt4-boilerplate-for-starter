import { z } from "zod";

const createRecipeSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  ingredients: z
    .array(z.string())
    .min(1, "At least one ingredient is required"),
  instructions: z
    .string()
    .min(10, "Instructions must be at least 10 characters"),
  cookingTime: z.number().positive("Cooking time must be positive"),
  servings: z.number().positive("Servings must be positive"),
  imageUrl: z.string().url("Invalid image URL").optional(),
  category: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  isPublic: z.boolean().optional().default(true),
});

export default defineEventHandler(async (event) => {
  const { userId } = await getUserFromEvent(event);

  try {
    const body = await readBody(event);
    const data = createRecipeSchema.parse(body);

    const recipe = await prisma.recipe.create({
      data: {
        ...data,
        authorId: userId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return recipe;
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message || "Failed to create recipe",
    });
  }
});
