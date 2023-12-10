
import RegisterUserService from '../../domain/services/auth/register-user'
import EmailValidator from '../../utils/helpers/email-validator'
import UserRepository from '../../infra/repository/user-repository'
import EncryptHelper from '../../utils/helpers/encrypter'
import { SignupController } from '../../presentation/controllers'

export default class SignupRouterComposer {
  static compose () {
    const encrypter = new EncryptHelper()
    const userRepository =  new UserRepository()
    return new SignupController(
      new RegisterUserService(userRepository, encrypter),
      new EmailValidator()
    )
  }
}
