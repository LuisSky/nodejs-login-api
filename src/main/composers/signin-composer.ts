import LoginService from '../../services/auth/login-service'
import SigninRouter from '../routes/auth/signin-router'
import UserRepository from '../../infra/repository/user-repository'
import TokenGenerator from '../../utils/helpers/token-generator'
import EncryptHelper from '../../utils/helpers/encrypter'
import env from '../config/env'

export default class SigninRouterCompose {
  static compose () {
    const loginService = new LoginService(
      new UserRepository(),
      new EncryptHelper(),
      new TokenGenerator(env.SECRET_TOKEN_PHRASE),
    )
    return new SigninRouter(loginService)
  }
}