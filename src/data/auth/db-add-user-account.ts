import { User } from '../../domain/entities/user'
import { IAddUserAccount, IAddUserAccountParams } from '../../domain/usecases/auth/add-user-account'
import { ICreateUserRepository } from '../protocols/create-user-repository'
import { ILoadUserByEmailRepository } from '../protocols/load-user-by-email-repository'
import { MissingParamError, ValidationError } from '../../utils/errors'
import { IEncrypter } from '../../utils/protocols'

export class DbAddUserAccount implements IAddUserAccount {
  constructor (
    private readonly loadUserByEmailRepository: ILoadUserByEmailRepository,
    private readonly userRepository: ICreateUserRepository,
    private readonly encrypter: IEncrypter) {}

  async add ({ email, password }: IAddUserAccountParams): Promise<User> {
    if (!email) throw new MissingParamError('email')
    if (!password) throw new MissingParamError('password')

    const verifyExistsUser = await this.loadUserByEmailRepository.findByEmail(email)

    if (verifyExistsUser) throw new ValidationError('this user alread exist')

    const hashPass = this.encrypter.hash(password)
    const user = await this.userRepository.createOne({ email, password: hashPass })
    return user
  }
}
