import LoginService from '../../domain/services/auth/login-service'
import UserRepository from '../../infra/repository/user-repository'
import { TokenGenerator, EncrypterHelper } from '../../utils/helpers'
import env from '../config/env'

import { SigninController } from '../../presentation/controllers'

export default class SigninRouterCompose {
  static compose () {
    const loginService = new LoginService(new UserRepository(), new EncrypterHelper(), new TokenGenerator(env.SECRET_TOKEN_PHRASE))
    return new SigninController(loginService)
  }
}
