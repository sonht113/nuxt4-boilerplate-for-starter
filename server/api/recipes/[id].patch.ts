import { z } from "zod";

const partialUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).optional(),
  isPublic: z.boolean().optional(),
});

export default defineEventHandler(async (event) => {
  const { userId } = await getUserFromEvent(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Recipe ID is required",
    });
  }

  try {
    // Check if recipe exists and user is the author
    const existingRecipe = await prisma.recipe.findUnique({
      where: { id },
    });

    if (!existingRecipe) {
      throw createError({
        statusCode: 404,
        message: "Recipe not found",
      });
    }

    if (existingRecipe.authorId !== userId) {
      throw createError({
        statusCode: 403,
        message: "You do not have permission to update this recipe",
      });
    }

    const body = await readBody(event);
    const data = partialUpdateSchema.parse(body);

    const recipe = await prisma.recipe.update({
      where: { id },
      data,
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
    if (error.statusCode) throw error;

    throw createError({
      statusCode: 400,
      message: error.message || "Failed to update recipe",
    });
  }
});
