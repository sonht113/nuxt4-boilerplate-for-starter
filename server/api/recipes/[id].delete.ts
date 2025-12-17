export default defineEventHandler(async (event) => {
  const { userId } = await getUserFromEvent(event);
  const id = getRouterParam(event, "id");

  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Recipe ID is required",
    });
  }

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
      message: "You do not have permission to delete this recipe",
    });
  }

  await prisma.recipe.delete({
    where: { id },
  });

  return {
    message: "Recipe deleted successfully",
  };
});
