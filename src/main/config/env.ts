export = {
  PORT: process.env.SERVER_PORT ?? 3000,

  SECRET_TOKEN_PHRASE: process.env.SECRET_TOKEN_PHRASE ?? 'any_secret_token',

  DB_CLIENT: process.env.DB_CLIENT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE
}
