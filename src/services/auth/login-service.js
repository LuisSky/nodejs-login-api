const { MissingParamError, ServerError } = require('../../utils/errors')

class LoginService {
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
    if (!this.verifyAllDependencyOfClass()) throw new ServerError('LoginService has invoked without some on dependency')
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

module.exports = LoginService
