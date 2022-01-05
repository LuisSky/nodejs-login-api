const userServiceFake = require('../services/user-service.js')
const EncryptHelper = require('../helpers/EncryptHelper.js')

class SignupRoute {  
  async route (httpRequest) {  
    try {
      const {email, password} = httpRequest.body
            
      const verifyExistsUser = await userServiceFake.findOne({ email })
      
      if (verifyExistsUser) throw new Error()
      
      const hashPass = await EncryptHelper.hash(password)      
      
      const user = await userServiceFake.createOne({ email, hashPass })
      
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
          error: 'invalid request'
        }
      }
    }
  }
}

module.exports = SignupRoute

