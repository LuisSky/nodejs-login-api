import { MissingParamError } from '../../../utils/errors'
import { IEncryptHelper, ITokenGenerator } from '../../../utils/protocols'
import { Service } from '../../../utils/protocols'
import { IUserRepository } from './interfaces'



export default class LoginService implements Service {
  
  constructor (private readonly userRepository: IUserRepository,
    private readonly encrypter: IEncryptHelper,
    private readonly tokenGenerator: ITokenGenerator){}

  async execute (email: string, password: string) {
    if (!email) throw new MissingParamError('email')
    if (!password) throw new MissingParamError('password')

    const user = await this.userRepository.findByEmail(email)

    const passwordCompare = user && await this.encrypter.compare(password, user.password)
    
    if (!passwordCompare) return null;
    
    const token = this.tokenGenerator.generate({ userid: user.id })
    return token
  }
}

