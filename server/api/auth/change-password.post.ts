import { z } from "zod";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

export default defineEventHandler(async (event) => {
  try {
    const { userId } = await getUserFromEvent(event);
    const body = await readBody(event);
    const { currentPassword, newPassword } = changePasswordSchema.parse(body);

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw createError({
        statusCode: 404,
        message: "User not found",
      });
    }

    // Verify current password
    const isValidPassword = await comparePassword(
      currentPassword,
      user.password
    );

    if (!isValidPassword) {
      throw createError({
        statusCode: 401,
        message: "Current password is incorrect",
      });
    }

    // Hash new password
    const hashedPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Revoke all refresh tokens (force re-login)
    await revokeAllUserTokens(userId);

    return {
      message: "Password changed successfully.  Please login again.",
    };
  } catch (error: any) {
    if (error.statusCode) throw error;

    throw createError({
      statusCode: 400,
      message: error.message || "Failed to change password",
    });
  }
});
