export interface OAuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
  tokenType: string
}

export interface User {
  id: string
  email: string
  firstName: string
  fullName: string
  patreonTier: string
}
