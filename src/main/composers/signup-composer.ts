import { TempMemoryRepository } from '../../infra/repository/temp-memory-repository'
import { IController } from '../../utils/protocols'
import { DbAddUserAccount } from '../../data/auth/db-add-user-account'
import { SignupController } from '../../presentation/controllers/auth'
import { RegExpEmailValidator, EncrypterHelper } from '../../utils/helpers'

export class SignupRouterComposer {
  static compose (): IController {
    const encrypter = new EncrypterHelper()
    const tempMemoryRepository = new TempMemoryRepository()
    const emailValidator = new RegExpEmailValidator()
    const dbAddUserAccount = new DbAddUserAccount(tempMemoryRepository, tempMemoryRepository, encrypter)
    return new SignupController(dbAddUserAccount, emailValidator)
  }
}
