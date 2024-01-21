import env from '../config/env'
import UserRepository from '../../infra/repository/user-repository'
import { DbUserAuthenticate } from '../../data/auth/db-user-authenticate'
import { SigninController } from '../../presentation/controllers/auth'
import { IController } from '../../utils/protocols'
import { TokenGenerator, EncrypterHelper } from '../../utils/helpers'

export class SigninRouterCompose {
  static compose (): IController {
    const loginService = new DbUserAuthenticate(new UserRepository(), new EncrypterHelper(), new TokenGenerator(env.SECRET_TOKEN_PHRASE))
    return new SigninController(loginService)
  }
}
