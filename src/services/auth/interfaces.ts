
export type User = {
  id: string,
  email: string,
  password: string
}

export type UserRepository = {
  createOne: (user: User) => any,
  findByEmail: (email: string) => any
}

export type IEncryptHelper = {
  hash: (pass: string) => any,
  compare: (hashPass: string, password: string) => any
}

export type ITokenGenerator = {
  generate: (payload: object) => any,
  decode: (token: string) => any
}

export type httpRequest = {
  body: any
}

export type httpResponse = {
  body: any,
  statusCode: number
}