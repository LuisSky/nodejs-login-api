import { User } from '../../domain/entities/user'
import { IAddUserAccount, IAddUserAccountParams } from '../../domain/usecases/auth/add-user-account'
import { ICreateUserRepository } from '../protocols/create-user-repository'
import { ILoadUserByEmailRepository } from '../protocols/load-user-by-email-repository'
import { MissingParamError, ValidationError } from '../../utils/errors'
import { IEncrypter } from '../../utils/protocols'

export class DbAddUserAccount implements IAddUserAccount {
  constructor (
    private readonly findUserByEmailRepository: ILoadUserByEmailRepository,
    private readonly userRepository: ICreateUserRepository,
    private readonly encrypter: IEncrypter) {}

  async add ({ email, password }: IAddUserAccountParams): Promise<User> {
    if (!this.userRepository) throw new MissingParamError('UserRepository')
    if (!this.encrypter) throw new MissingParamError('EncrypterHelper')

    if (!email) throw new ValidationError('email')
    if (!password) throw new ValidationError('password')

    const verifyExistsUser = await this.findUserByEmailRepository.findByEmail(email)

    if (verifyExistsUser) throw new ValidationError('this user alread exist')

    const hashPass = this.encrypter.hash(password)
    const user = await this.userRepository.createOne({ id: 'asdsfasfas', email, password: hashPass })
    return user
  }
}
