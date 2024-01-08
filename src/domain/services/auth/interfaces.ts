export interface User {
  id: string
  email: string
  password: string
}

export interface IFindUserByEmailRepository {
  findByEmail: (email: string) => any
}

export interface ICreateUserRepository {
  createOne: (user: User) => any
}
