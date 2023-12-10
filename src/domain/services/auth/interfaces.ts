export interface User {
  id: string
  email: string
  password: string
}

export interface IUserRepository {
  createOne: (user: User) => any
  findByEmail: (email: string) => any
}
