import { User } from '../entities/user'

export interface AddUserAccount {
  add: (user: AddUserAccountParams) => Promise<User>
}

export type AddUserAccountParams = Omit<User, 'id'>
