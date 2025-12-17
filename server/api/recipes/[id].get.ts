export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Recipe ID is required",
    });
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id },
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

  if (!recipe) {
    throw createError({
      statusCode: 404,
      message: "Recipe not found",
    });
  }

  // Check if recipe is public or user is the author
  try {
    const { userId } = await getUserFromEvent(event);
    if (!recipe.isPublic && recipe.authorId !== userId) {
      throw createError({
        statusCode: 403,
        message: "You do not have permission to view this recipe",
      });
    }
  } catch (error) {
    // If not authenticated and recipe is private, deny access
    if (!recipe.isPublic) {
      throw createError({
        statusCode: 403,
        message: "This recipe is private",
      });
    }
  }

  return recipe;
});
