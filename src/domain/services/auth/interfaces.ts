
export type User = {
  id: string,
  email: string,
  password: string
}

export type IUserRepository = {
  createOne: (user: User) => any,
  findByEmail: (email: string) => any
}