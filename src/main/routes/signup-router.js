
const EncryptHelper = require('../../utils/helpers/encrypter')
const UserRepository = require('../../infra/repository/user-repository')
const RegisterUserService = require('../../services/auth/register-user')
const HttpResponse = require('../../utils/helpers/http-response')
const { MissingParamError } = require('../../utils/errors')

class SignupRoute {
  async route (httpRequest) {
    try {
      if (!httpRequest.body) return HttpResponse.badRequest(new MissingParamError('body'))
      if (!httpRequest.body.email) return HttpResponse.badRequest(new MissingParamError('email'))

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
