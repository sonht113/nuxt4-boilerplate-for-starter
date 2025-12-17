export default defineEventHandler(async (event) => {
  const { userId } = await getUserFromEvent(event);

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          recipes: true,
        },
      },
    },
  });

  if (!user) {
    throw createError({
      statusCode: 404,
      message: "User not found",
    });
  }

  return user;
});
