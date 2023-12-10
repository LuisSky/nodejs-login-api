
import RegisterUserService from '../../domain/services/auth/register-user'
import { EmailValidator, EncrypterHelper } from '../../utils/helpers'
import UserRepository from '../../infra/repository/user-repository'
import { SignupController } from '../../presentation/controllers'

export default class SignupRouterComposer {
  static compose () {
    const encrypter = new EncrypterHelper()
    const userRepository =  new UserRepository()
    return new SignupController(
      new RegisterUserService(userRepository, encrypter),
      new EmailValidator()
    )
  }
}
