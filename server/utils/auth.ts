import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import type { H3Event } from 'h3'
import { randomBytes } from 'crypto'

export interface JWTPayload {
  userId: string
  email: string
  type: 'access' | 'refresh'
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10)
}

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash)
}

// Access token (short-lived:  15 minutes)
export const generateAccessToken = (userId: string, email: string): string => {
  const config = useRuntimeConfig()
  return jwt.sign(
    { userId, email, type: 'access' },
    config.jwtSecret,
    { expiresIn: '1d' }
  )
}

// Refresh token (long-lived: 7 days)
export const generateRefreshToken = (): string => {
  return randomBytes(64).toString('hex')
}

export const verifyAccessToken = (token: string): JWTPayload => {
  const config = useRuntimeConfig()
  try {
    const payload = jwt.verify(token, config.jwtSecret) as JWTPayload
    if (payload.type !== 'access') {
      throw new Error('Invalid token type')
    }
    return payload
  } catch (error) {
    throw new Error('Invalid or expired token')
  }
}

// Get user from Authorization header
export const getUserFromEvent = async (event: H3Event): Promise<JWTPayload> => {
  const authHeader = getHeader(event, 'authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized:  No token provided'
    })
  }

  const token = authHeader.substring(7)

  try {
    const payload = verifyAccessToken(token)
    return payload
  } catch (error) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized: Invalid or expired token'
    })
  }
}

// Store refresh token in database
export const storeRefreshToken = async (userId: string, token: string) => {
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

  return await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt
    }
  })
}

// Validate refresh token
export const validateRefreshToken = async (token: string) => {
  const refreshToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: true }
  })

  if (!refreshToken) {
    throw new Error('Invalid refresh token')
  }

  if (refreshToken. expiresAt < new Date()) {
    // Delete expired token
    await prisma.refreshToken.delete({
      where: { id: refreshToken.id }
    })
    throw new Error('Refresh token expired')
  }

  return refreshToken
}

// Revoke refresh token
export const revokeRefreshToken = async (token: string) => {
  await prisma.refreshToken.deleteMany({
    where: { token }
  })
}

// Revoke all user's refresh tokens
export const revokeAllUserTokens = async (userId: string) => {
  await prisma.refreshToken.deleteMany({
    where: { userId }
  })
}

// Clean expired tokens (can be called periodically)
export const cleanExpiredTokens = async () => {
  await prisma.refreshToken.deleteMany({
    where: {
      expiresAt: {
        lt: new Date()
      }
    }
  })
}