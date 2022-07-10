declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_APPLICATION_CREDENTIALS: string
      DRIVE_ROOT_DIRECTORY_ID: string
      PATREON_OAUTH_CLIENT_ID: string
      PATREON_OAUTH_CLIENT_SECRET: string
      PATREON_API_VERSION: string
      CLIENT_ENDPOINT: string
    }
  }
}
