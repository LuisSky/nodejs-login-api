import { User } from '../../domain/entities/user'

export interface ICreateUserRepository {
  createOne: (user: User) => any
}
