import { MissingParamError } from '../../utils/errors'
import { IEncrypter, ITokenGenerator } from '../../utils/protocols'
import { IUserAuthenticate, IUserAuthenticateParams } from '../../domain/usecases/auth/user-authenticate'
import { ILoadUserByEmailRepository } from '../protocols/load-user-by-email-repository'

export class DbUserAuthenticate implements IUserAuthenticate {
  constructor (private readonly loadUserByEmailRepository: ILoadUserByEmailRepository,
    private readonly encrypter: IEncrypter,
    private readonly tokenGenerator: ITokenGenerator) {}

  async auth (credentials: IUserAuthenticateParams): Promise<any> {
    if (!credentials.email) throw new MissingParamError('email')
    if (!credentials.password) throw new MissingParamError('password')

    const { email, password } = credentials
    const user = await this.loadUserByEmailRepository.findByEmail(email)

    const passwordCompare = user && await this.encrypter.compare(password, user.password)

    if (!passwordCompare) return null

    const token = this.tokenGenerator.generate({ userid: user.id })
    return token
  }
}
