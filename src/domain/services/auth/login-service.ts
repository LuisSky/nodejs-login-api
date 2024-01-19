import { MissingParamError } from '../../../utils/errors'
import { IEncrypter, ITokenGenerator, Service } from '../../../utils/protocols'
import { User } from '../../entities/user'
import { IFindUserByEmailRepository } from './interfaces'

export default class LoginService implements Service {
  constructor (private readonly findUserByEmailRepository: IFindUserByEmailRepository,
    private readonly encrypter: IEncrypter,
    private readonly tokenGenerator: ITokenGenerator) {}

  async execute (email: string, password: string): Promise<string | null > {
    if (!email) throw new MissingParamError('email')
    if (!password) throw new MissingParamError('password')

    const user = await this.findUserByEmailRepository.findByEmail(email) as User

    const passwordCompare = user && await this.encrypter.compare(password, user.password)

    if (!passwordCompare) return null

    const token = this.tokenGenerator.generate({ userid: user.id })
    return token
  }
}
