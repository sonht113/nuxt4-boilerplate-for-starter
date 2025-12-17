import { z } from "zod";

const querySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  includePrivate: z.string().optional().default("true"),
});

export default defineEventHandler(async (event) => {
  const { userId } = await getUserFromEvent(event);

  try {
    const query = getQuery(event);
    const { page, limit, includePrivate } = querySchema.parse(query);

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const where: any = { authorId: userId };

    // If includePrivate is false, only show public recipes
    if (includePrivate === "false") {
      where.isPublic = true;
    }

    const [recipes, total] = await Promise.all([
      prisma.recipe.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: "desc" },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.recipe.count({ where }),
    ]);

    return {
      recipes,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message || "Failed to fetch your recipes",
    });
  }
});
