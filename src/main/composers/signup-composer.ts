import SignupRoute from '../routes/auth/signup-router'

import RegisterUserService from '../../services/auth/register-user'
import EmailValidator from '../../utils/helpers/email-validator'
import UserRepository from '../../infra/repository/user-repository'
import EncryptHelper from '../../utils/helpers/encrypter'

export default class SignupRouterComposer {
  static compose () {
    return new SignupRoute(
      new RegisterUserService(
      new UserRepository(),
      new EncryptHelper()
      ),
      new EmailValidator()
    )
  }
}
