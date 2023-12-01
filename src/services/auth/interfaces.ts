
export type User = {
  id: string,
  email: string,
  password: string
}

export type IUserRepository = {
  createOne: (user: User) => any,
  findByEmail: (email: string) => any
}

export interface ILoginService {
  verifyLogin(email: string, password: string): Promise<null | any>
}

export type IEncryptHelper = {
  hash: (pass: string) => any,
  compare: (hashPass: string, password: string) => any
}

export interface ITokenGenerator {
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