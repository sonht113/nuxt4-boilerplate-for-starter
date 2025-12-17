import { z } from "zod";

const refreshSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { refreshToken: token } = refreshSchema.parse(body);

    // Validate refresh token
    const refreshTokenData = await validateRefreshToken(token);

    // Generate new tokens
    const accessToken = generateAccessToken(
      refreshTokenData.user.id,
      refreshTokenData.user.email
    );
    const newRefreshToken = generateRefreshToken();

    // Delete old refresh token and store new one
    await revokeRefreshToken(token);
    await storeRefreshToken(refreshTokenData.user.id, newRefreshToken);

    return {
      user: {
        id: refreshTokenData.user.id,
        email: refreshTokenData.user.email,
        name: refreshTokenData.user.name,
      },
      accessToken,
      refreshToken: newRefreshToken,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 401,
      message: error.message || "Invalid or expired refresh token",
    });
  }
});
