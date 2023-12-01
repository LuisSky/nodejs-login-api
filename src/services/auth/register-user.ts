import { ValidationError, MissingParamError } from '../../utils/errors'
import EncryptHelper from '../../utils/helpers/encrypter'
import { IRegisterUserService, IUserRepository } from './interfaces'


export default class RegisterUserService implements IRegisterUserService {
   
  constructor ( private readonly userRepository: IUserRepository, 
    private readonly encrypter: EncryptHelper){}
    
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
