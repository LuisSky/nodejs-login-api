const SignupRoute = require('../signup-router')

const RegisterUserService = require('../../../services/auth/register-user')
const EmailValidator = require('../../../utils/helpers/email-validator')
const UserRepository = require('../../../infra/repository/user-repository')
const EncryptHelper = require('../../../utils/helpers/encrypter')

module.exports = class SignupRouterComposer {
  static compose () {
    return new SignupRoute({
      registerUserService: new RegisterUserService({
        userRepository: new UserRepository(),
        encrypterHelper: new EncryptHelper()
      }),
      emailValidator: new EmailValidator()
    })
  }
}
