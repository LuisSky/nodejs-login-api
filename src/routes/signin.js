
const UserService = require('../services/user-service.js')

class SigninRoute {
  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body

      const userService = new UserService()
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
