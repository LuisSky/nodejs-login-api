import { User } from "../../services/auth/interfaces"

let users: User[] = []

export default class UserRepository {
  createOne (user: User) {
    return users.push(user)
  }
  findByEmail (email: string) {
    return users.find((user) => user.email === email)
  }
}

