import { env } from '../../config/env'
import { DbUserAuthenticate } from '../../../data/auth/db-user-authenticate'
import { SigninController } from '../../../presentation/controllers/auth'
import { IController } from '../../../utils/protocols'
import { TokenGenerator, EncrypterHelper } from '../../../utils/helpers'
// import { TempMemoryRepository } from '../../infra/repository/temp-memory-repository'
import { PostgresUserRepository } from '../../../infra/repository/postgres-user-repository'

export class SigninRouterComposer {
  static compose (): IController {
    const loginService = new DbUserAuthenticate(new PostgresUserRepository(), new EncrypterHelper(), new TokenGenerator(env.SECRET_TOKEN_PHRASE))
    return new SigninController(loginService)
  }
}
