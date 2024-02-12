class Env {
  // Server port
  readonly PORT: number = Number(process.env.SERVER_PORT) ?? 3000

  // Webtoken
  readonly SECRET_TOKEN_PHRASE: string = process.env.SECRET_TOKEN_PHRASE ?? 'any_secret_token'

  // Database
  readonly DB_CLIENT: string | undefined = process.env.DB_CLIENT
  readonly DB_HOST: string | undefined = process.env.DB_HOST
  readonly DB_PORT: number = Number(process.env.DB_PORT)
  readonly DB_USER: string | undefined = process.env.DB_USER
  readonly DB_PASSWORD: string | undefined = process.env.DB_PASSWORD
  readonly DB_DATABASE: string | undefined = process.env.DB_DATABASE
}

export const env = new Env()
