import LoginService from '../../domain/services/auth/login-service'
import UserRepository from '../../infra/repository/user-repository'
import { TokenGenerator, EncrypterHelper } from '../../utils/helpers'
import env from '../config/env'

import { SigninController } from '../../presentation/controllers/auth'
import { IController } from '../../utils/protocols'

export class SigninRouterCompose {
  static compose (): IController {
    const loginService = new LoginService(new UserRepository(), new EncrypterHelper(), new TokenGenerator(env.SECRET_TOKEN_PHRASE))
    return new SigninController(loginService)
  }
}
