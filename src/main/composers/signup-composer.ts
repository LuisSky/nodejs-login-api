import RegisterUserService from '../../domain/services/auth/register-user'
import { RegExpEmailValidator, EncrypterHelper } from '../../utils/helpers'
import UserRepository from '../../infra/repository/user-repository'
import { SignupController } from '../../presentation/controllers/auth'
import { Controller } from '../../utils/protocols'

export class SignupRouterComposer {
  static compose (): Controller {
    const encrypter = new EncrypterHelper()
    const userRepository = new UserRepository()
    const emailValidator = new RegExpEmailValidator()
    const registerUserService = new RegisterUserService(userRepository, userRepository, encrypter)
    return new SignupController(registerUserService, emailValidator)
  }
}
