
const { MissingParamError } = require('../helpers/errors')

class SigninRoute {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    try {
      if (!httpRequest.body) {
        return {
          statusCode: 400,
          body: new MissingParamError('body')
        }
      }
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

      const token = await this.authUseCase.verifyLogin(email, password)

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
