import { User } from '../../domain/services/auth/interfaces'

const users: User[] = []

export default class UserRepository {
  createOne (user: User): any {
    users.push(user)
    const { password, ...newUser } = user
    return newUser
  }

  findByEmail (email: string): any {
    return users.find((user) => user.email === email)
  }
}
