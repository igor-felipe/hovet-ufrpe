declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string
      JWT_SECRET: string
      JWT_EXPIRATION_TIME: string
      DATABASE_URL: string
    }
  }
}

export {}
