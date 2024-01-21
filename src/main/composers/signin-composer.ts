import env from '../config/env'
import { DbUserAuthenticate } from '../../data/auth/db-user-authenticate'
import { SigninController } from '../../presentation/controllers/auth'
import { IController } from '../../utils/protocols'
import { TokenGenerator, EncrypterHelper } from '../../utils/helpers'
import { TempMemoryRepository } from '../../infra/repository/temp-memory-repository'

export class SigninRouterCompose {
  static compose (): IController {
    const loginService = new DbUserAuthenticate(new TempMemoryRepository(), new EncrypterHelper(), new TokenGenerator(env.SECRET_TOKEN_PHRASE))
    return new SigninController(loginService)
  }
}
