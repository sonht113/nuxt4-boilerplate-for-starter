import { z } from "zod";

const querySchema = z.object({
  page: z.string().optional().default("1"),
  limit: z.string().optional().default("10"),
  search: z.string().optional(),
  category: z.string().optional(),
  difficulty: z.string().optional(),
  authorId: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const { page, limit, search, category, difficulty, authorId } =
      querySchema.parse(query);

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = {
      isPublic: true,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (difficulty) {
      where.difficulty = difficulty;
    }

    if (authorId) {
      where.authorId = authorId;
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
      message: error.message || "Failed to fetch recipes",
    });
  }
});
