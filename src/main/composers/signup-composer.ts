import SignupRoute from '../routes/auth/signup-router'

import RegisterUserService from '../../domain/services/auth/register-user'
import EmailValidator from '../../utils/helpers/email-validator'
import UserRepository from '../../infra/repository/user-repository'
import EncryptHelper from '../../utils/helpers/encrypter'

export default class SignupRouterComposer {
  static compose () {
    const encrypter = new EncryptHelper()
    const userRepository =  new UserRepository()
    return new SignupRoute(
      new RegisterUserService(userRepository, encrypter),
      new EmailValidator()
    )
  }
}
