import { ICreateUserRepository } from '../../data/protocols/create-user-repository'
import { ILoadUserByEmailRepository } from '../../data/protocols/load-user-by-email-repository'
import { User } from '../../domain/entities/user'

const users: User[] = []

export class TempMemoryRepository implements ICreateUserRepository, ILoadUserByEmailRepository {
  createOne (user: User): any {
    users.push(user)
    const { password, ...newUser } = user
    return newUser
  }

  findByEmail (email: string): any {
    return users.find((user) => user.email === email)
  }
}
