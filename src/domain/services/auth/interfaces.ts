
export type User = {
  id: string,
  email: string,
  password: string
}

export type IUserRepository = {
  createOne: (user: User) => any,
  findByEmail: (email: string) => any
}



export type httpRequest = {
  body: any
}

export type httpResponse = {
  body: any,
  statusCode: number
}