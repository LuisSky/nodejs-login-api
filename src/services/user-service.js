const { ValidationError, UnauthorizedError } = require('../helpers/errors')
const MissingParamError = require('../helpers/errors/missing-param-error')

class UserService {
  constructor ({ userRepository, encryptHelper, tokenGenerator } = {}) {
    this.userRepository = userRepository
    this.encrypter = encryptHelper
    this.tokenGenerator = tokenGenerator
  }

  verifyAllDependencyOfClass () {
    if (!this.userRepository || !this.encrypter || !this.tokenGenerator) {
      return false
    }
    return true
  }

  async verifyLogin (email, password) {
    if (!this.verifyAllDependencyOfClass()) throw new MissingParamError('UserService was invoked without correct dependencys')
    if (!email) throw new ValidationError('email is obrigatory')
    if (!password) throw new ValidationError('password is obrigatory')

    const user = await this.userRepository.findOne({ email })

    const passwordCompare = user && await this.encrypter.compare(password, user.password)
    if (!passwordCompare) throw new UnauthorizedError('Invalid user or password')

    const token = this.tokenGenerator.generate({ userid: user.id })
    return token
  }
}

module.exports = UserService
