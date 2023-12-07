import { User } from "../../domain/services/auth/interfaces"

let users: User[] = []

export default class UserRepository {
  createOne (user: User) {
    users.push(user)
    const { password, ...newUser } = user
    return newUser
  }
  findByEmail (email: string) {
    return users.find((user) => user.email === email)
  }
}

