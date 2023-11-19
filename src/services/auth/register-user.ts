import { ValidationError, MissingParamError } from '../../utils/errors'
import { IEncryptHelper, UserRepository } from './interfaces'


export default class RegisterUserService {
  constructor (
    private readonly userRepository: UserRepository,
    private readonly encrypter: IEncryptHelper ) {}

  async execute (email: string, password: string) {
    if (!this.userRepository) throw new MissingParamError('UserRepository')
    if (!this.encrypter) throw new MissingParamError('EncrypterHelper')

    if (!email) throw new ValidationError('email')
    if (!password) throw new ValidationError('password')

    const verifyExistsUser = await this.userRepository.findByEmail(email)

    if (verifyExistsUser) throw new ValidationError('this user alread exist')

    const hashPass = await this.encrypter.hash(password)
    const user = await this.userRepository.createOne({id: "asdsfasfas", email, password: hashPass })
    return user
  }
}
