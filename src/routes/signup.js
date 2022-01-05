const userServiceFake = require('../services/user-service.js')

class SigninRoute {
  
  async route (httpRequest) {
  
    try {
      const {email, password} = httpRequest.body
      
      const user = userServiceFake.createOne({ email, password })
      
      return {
        statusCode: 201,
        body: {
          title: 'User created', email, password
        }
      }
    }
    catch(err) {
      return {
        statusCode: 400,
        body: {
          error: 'invalid request'
        }
      }
    }
  }
}

module.exports = SigninRoute
