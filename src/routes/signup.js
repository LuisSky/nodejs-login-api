const UserService = require('../services/userservice.js')

class SignupRoute {  
  async route (httpRequest) {  
    try {
      const {email, password} = httpRequest.body
         
      const userService = new UserService()      
      const user = await userService.registerUser(email, password)
      
      return {
        statusCode: 201,
        body: {
          ...user
        }
      }
    }
    catch(err) {
      return {
        statusCode: 400,
        body: {
          error: 'invalid request',
          err: err.message
        }
      }
    }
  }
}

module.exports = SignupRoute

