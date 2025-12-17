import { z } from "zod";

const logoutSchema = z.object({
  refreshToken: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  try {
    const { userId } = await getUserFromEvent(event);
    const body = await readBody(event);
    const { refreshToken } = logoutSchema.parse(body);

    if (refreshToken) {
      // Revoke specific refresh token
      await revokeRefreshToken(refreshToken);
    } else {
      // Revoke all user's refresh tokens
      await revokeAllUserTokens(userId);
    }

    return {
      message: "Logged out successfully",
    };
  } catch (error: any) {
    throw createError({
      statusCode: 400,
      message: error.message || "Failed to logout",
    });
  }
});
