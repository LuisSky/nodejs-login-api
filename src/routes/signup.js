const userServiceFake = require('../services/user-service.js')
const { UnauthorizedError } = require('../helpers/errors')


module.exports = class SigninRoute {

  async route (httpRequest) {
  
    try {
      const {email, password} = httpRequest.body
      
      const user = userServiceFake.findOne({ email })
      
      if (!user) return {
        statusCode: 400,
        body: new UnauthorizedError()
      }
      
      return {
        statusCode: 200,
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