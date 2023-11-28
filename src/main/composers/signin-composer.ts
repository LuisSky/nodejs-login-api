import LoginService from '../../services/auth/login-service'
import SigninRouter from '../routes/auth/signin-router'
import UserRepository from '../../infra/repository/user-repository'
import TokenGenerator from '../../utils/helpers/token-generator'
import Encrypter from '../../utils/helpers/encrypter'
import env from '../config/env'

export default class SigninRouterCompose {
  static compose () {
    const loginService = new LoginService({
      encrypter: new Encrypter(),
      tokenGenerator: new TokenGenerator(env.SECRET_TOKEN_PHRASE),
      userRepository: new UserRepository()
    })
    return new SigninRouter(loginService)
  }
}
