
const UserRepository = require('../repository/user-repository.js')
const UserService = require('../services/user-service.js')
const TokenGenerator = require('../helpers/token-generator.js')

class UserRouteGet {  
  async route (httpRequest) {  
    try {
      // const {email, password} = httpRequest.body
         
      // const userService = new UserService()      
      // const user = await userService.registerUser(email, password)
      const users = new UserRepository().findAll()
      
      return {
        statusCode: 200,
        body: {
          ...users
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

class UserRoutePost {  
  async route (httpRequest) {  
    try {
    
      const resp = await new TokenGenerator().decode(httpRequest.body.token)
            
      return {
        statusCode: 200,
        body: {
          ...resp
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

module.exports = { UserRouteGet, UserRoutePost }



