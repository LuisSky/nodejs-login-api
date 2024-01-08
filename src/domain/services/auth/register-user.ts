import { ValidationError, MissingParamError } from '../../../utils/errors'
import { Encrypter, Service } from '../../../utils/protocols'
import { ICreateUserRepository, IFindUserByEmailRepository } from './interfaces'

export default class RegisterUserService implements Service {
  constructor (

    private readonly findUserByEmailRepository: IFindUserByEmailRepository,
    private readonly userRepository: ICreateUserRepository,
    private readonly encrypter: Encrypter) {}

  async execute ({ email, password }: Record<string, string>): Promise<any> {
    if (!this.userRepository) throw new MissingParamError('UserRepository')
    if (!this.encrypter) throw new MissingParamError('EncrypterHelper')

    if (!email) throw new ValidationError('email')
    if (!password) throw new ValidationError('password')

    const verifyExistsUser = await this.findUserByEmailRepository.findByEmail(email)

    if (verifyExistsUser) throw new ValidationError('this user alread exist')

    const hashPass = this.encrypter.hash(password) as string
    const user = await this.userRepository.createOne({ id: 'asdsfasfas', email, password: hashPass })
    return user
  }
}
