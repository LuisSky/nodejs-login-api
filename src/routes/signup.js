const UserService = require('../services/user-service.js')

class SignupRoute {
  async route (httpRequest) {
    try {
      const { email, password } = httpRequest.body

      const userService = new UserService()
      const user = await userService.registerUser(email, password)

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
