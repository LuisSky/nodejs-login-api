import { MissingParamError, ServerError } from '../../utils/errors'
import { IEncryptHelper, ITokenGenerator, UserRepository } from './interfaces'


type LoginServiceParams = {
  userRepository: UserRepository,
  encrypter: IEncryptHelper,
  tokenGenerator: ITokenGenerator
}

export default class LoginService {
  private readonly userRepository: UserRepository
  private readonly encrypter: IEncryptHelper
  private readonly tokenGenerator: ITokenGenerator
  
  constructor ({ userRepository, encrypter, tokenGenerator }: LoginServiceParams) {
    this.userRepository = userRepository   
    this.encrypter = encrypter
    this.tokenGenerator = tokenGenerator
  }

  async verifyLogin (email: string, password: string) {
    if (!email) throw new MissingParamError('email')
    if (!password) throw new MissingParamError('password')

    const user = await this.userRepository.findByEmail(email)

    const passwordCompare = user && await this.encrypter.compare(password, user.password)
    if (passwordCompare) {
      const token = this.tokenGenerator.generate({ userid: user.id })
      return token
    }
    return null
  }
}

