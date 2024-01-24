import { IController } from '../../utils/protocols'
import { DbAddUserAccount } from '../../data/auth/db-add-user-account'
import { SignupController } from '../../presentation/controllers/auth'
import { RegExpEmailValidator, EncrypterHelper } from '../../utils/helpers'
// import { TempMemoryRepository } from '../../infra/repository/temp-memory-repository'
import { PostgresUserRepository } from '../../infra/repository/postgres-user-repository'

export class SignupRouterComposer {
  static compose (): IController {
    const encrypter = new EncrypterHelper()
    // const tempMemoryRepository = new TempMemoryRepository()
    const postgresUserRepository = new PostgresUserRepository()
    const emailValidator = new RegExpEmailValidator()
    const dbAddUserAccount = new DbAddUserAccount(postgresUserRepository, postgresUserRepository, encrypter)
    return new SignupController(dbAddUserAccount, emailValidator)
  }
}
