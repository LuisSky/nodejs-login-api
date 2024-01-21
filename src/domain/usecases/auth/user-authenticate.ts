import { User } from '../../entities/user'

export interface IUserAuthenticate {
  auth: (user: IUserAuthenticateParams) => Promise<any>
}

export type IUserAuthenticateParams = Pick<User, 'email' | 'password'>
