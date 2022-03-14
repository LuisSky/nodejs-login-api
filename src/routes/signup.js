
const EncryptHelper = require('../helpers/encrypter')
const UserRepository = require('../repository/user-repository.js')
const RegisterUserService = require('../services/auth/register-user')

class SignupRoute {
  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body

      const registerUserService = new RegisterUserService({ userRepository: new UserRepository(), encrypterHelper: new EncryptHelper() })
      const user = await registerUserService.execute(email, password)

      return {
        statusCode: 201,
        body: {
          ...user
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

module.exports = SignupRoute
