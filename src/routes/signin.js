
const UserService = require('../services/user-service.js')
const TokenGenerator = require('../helpers/token-generator')
const EncryptHelper = require('../helpers/encrypter')
const UserRepository = require('../repository/user-repository.js')
const { MissingParamError } = require('../helpers/errors')

class SigninRoute {
  async route (httpRequest) {
    try {
      if (!httpRequest.email) {
        return {
          statusCode: 400,
          body: new MissingParamError('email')
        }
      }
      if (!httpRequest.password) {
        return {
          statusCode: 400,
          body: new MissingParamError('password')
        }
      }
      const { email, password } = httpRequest.body

      const userService = new UserService({
        userRepository: new UserRepository(),
        encryptHelper: new EncryptHelper(),
        tokenGenerator: new TokenGenerator()
      })

      const token = await userService.verifyLogin(email, password)

      return {
        statusCode: 200,
        body: {
          token
        }
      }
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500
        err.message = 'internal error'
        err.error = 'internal error'
      }
      return {
        statusCode: err.statusCode,
        body: {
          type: err.message,
          error: err.error
        }
      }
    }
  }
}

module.exports = SigninRoute
