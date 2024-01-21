import { User } from '../../entities/user'

export interface IAddUserAccount {
  add: (user: IAddUserAccountParams) => Promise<User>
}

export type IAddUserAccountParams = Omit<User, 'id'>
