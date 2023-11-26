import { ValidationError, MissingParamError } from '../../utils/errors'
import EncryptHelper from '../../utils/helpers/encrypter'
import { UserRepository } from './interfaces'


type RegisterUserServiceParams = {
   userRepository: UserRepository,
   encrypter: EncryptHelper 
}

export default class RegisterUserService {
  private readonly userRepository: UserRepository 
  private readonly encrypter: EncryptHelper 
  
  constructor ( { userRepository, encrypter }: RegisterUserServiceParams ) {
    this.userRepository = userRepository
    this.encrypter = encrypter
  }
  async execute ({ email, password }: Record<string, string> ) {
    if (!this.userRepository) throw new MissingParamError('UserRepository')
    if (!this.encrypter) throw new MissingParamError('EncrypterHelper')

    if (!email) throw new ValidationError('email')
    if (!password) throw new ValidationError('password')

    const verifyExistsUser = await this.userRepository.findByEmail(email)

    if (verifyExistsUser) throw new ValidationError('this user alread exist')

    const hashPass = this.encrypter.hash(password) as string
    const user = await this.userRepository.createOne({ id: "asdsfasfas", email, password: hashPass })
    return user
  }
}
