import { User } from '../../entities/user'

export interface IFindUserByEmailRepository {
  findByEmail: (email: string) => any
}

export interface ICreateUserRepository {
  createOne: (user: User) => any
}
