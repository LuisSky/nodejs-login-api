import { MissingParamError, ServerError } from '../../utils/errors'
import { IEncryptHelper, ITokenGenerator } from '../../utils/helpers/protocols'
import { IUserRepository, ILoginService } from './interfaces'


export default class LoginService implements ILoginService {
  
  constructor (private readonly userRepository: IUserRepository,
    private readonly encrypter: IEncryptHelper,
    private readonly tokenGenerator: ITokenGenerator){}

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

