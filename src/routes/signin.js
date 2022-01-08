
const UserService = require('../services/user-service.js')
const EncryptHelper = require('../helpers/EncryptHelper.js')


class SigninRoute {
  async route (httpRequest) {
    try {
      const {email, password} = httpRequest.body
      
      const userService = new UserService()
      const token = await userService.verifyLogin(email, password)
      
      return {
        statusCode: 200,
        body: {
          token
        }
      }
    }
    catch(err) {
      return {
        statusCode: err.statusCode | 400,
        body: {
          type: err.message,
          error: err.error
        }
      }
    }
  }
}

module.exports = SigninRoute