export default defineEventHandler(async (event) => {
  try {
    const { userId } = await getUserFromEvent(event);

    const [totalRecipes, publicRecipes, privateRecipes] = await Promise.all([
      prisma.recipe.count({
        where: { authorId: userId },
      }),
      prisma.recipe.count({
        where: { authorId: userId, isPublic: true },
      }),
      prisma.recipe.count({
        where: { authorId: userId, isPublic: false },
      }),
    ]);

    return {
      totalRecipes,
      publicRecipes,
      privateRecipes,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message || "Failed to fetch stats",
    });
  }
});
