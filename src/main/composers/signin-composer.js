const LoginService = require('../../services/auth/login-service')
const SigninRouter = require('../routes/auth/signin-router')
const UserRepository = require('../../infra/repository/user-repository')
const TokenGenerator = require('../../utils/helpers/token-generator')
const EncryptHelper = require('../../utils/helpers/encrypter')
const env = require('../config/env')

module.exports = class SigninRouterCompose {
  static compose () {
    const loginService = new LoginService({
      userRepository: new UserRepository(),
      tokenGenerator: new TokenGenerator(env.SECRET_TOKEN_PHRASE),
      encryptHelper: new EncryptHelper()
    })
    return new SigninRouter(loginService)
  }
}
