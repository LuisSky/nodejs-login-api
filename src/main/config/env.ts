import dotenv from 'dotenv'
dotenv.config()

export = {
  PORT: process.env.SERVER_PORT,

  SECRET_TOKEN_PHRASE: process.env.SECRET_TOKEN_PHRASE || "any_phrase",

  DB_CLIENT: process.env.DB_CLIENT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
}
