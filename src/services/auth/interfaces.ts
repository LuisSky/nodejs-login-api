
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

export interface IRegisterUserService {
  execute ({ email, password }: Record<string, string> ): Promise<any>
}

export type httpRequest = {
  body: any
}

export type httpResponse = {
  body: any,
  statusCode: number
}