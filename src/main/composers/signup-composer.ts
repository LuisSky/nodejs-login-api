import UserRepository from '../../infra/repository/user-repository'
import { IController } from '../../utils/protocols'
import { DbAddUserAccount } from '../../data/auth/db-add-user-account'
import { SignupController } from '../../presentation/controllers/auth'
import { RegExpEmailValidator, EncrypterHelper } from '../../utils/helpers'

export class SignupRouterComposer {
  static compose (): IController {
    const encrypter = new EncrypterHelper()
    const userRepository = new UserRepository()
    const emailValidator = new RegExpEmailValidator()
    const dbAddUserAccount = new DbAddUserAccount(userRepository, userRepository, encrypter)
    return new SignupController(dbAddUserAccount, emailValidator)
  }
}
