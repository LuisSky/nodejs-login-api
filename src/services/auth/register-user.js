const { ValidationError, MissingParamError } = require('../../utils/errors')

module.exports = class RegisterUserService {
  constructor ({ userRepository, encrypterHelper } = {}) {
    this.userRepository = userRepository
    this.encrypterHelper = encrypterHelper
  }

  async execute ({ email, password } = {}) {
    if (!this.userRepository) throw new MissingParamError('UserRepository')
    if (!this.encrypterHelper) throw new MissingParamError('EncrypterHelper')

    if (!email) throw new ValidationError('email')
    if (!password) throw new ValidationError('password')

    const verifyExistsUser = await this.userRepository.findOne({ email })

    if (verifyExistsUser) throw new ValidationError('this user alread exist')

    const hashPass = await this.encrypterHelper.hash(password)

    const user = await this.userRepository.createOne({ email, password: hashPass })
    return user
  }
}
