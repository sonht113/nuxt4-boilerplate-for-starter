export default defineEventHandler(async (event) => {
  try {
    const categories = await prisma.recipe.findMany({
      where: {
        category: {
          not: null,
        },
        isPublic: true,
      },
      select: {
        category: true,
      },
      distinct: ["category"],
    });

    const uniqueCategories = categories
      .map((r) => r.category)
      .filter(Boolean)
      .sort();

    return {
      categories: uniqueCategories,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message || "Failed to fetch categories",
    });
  }
});
