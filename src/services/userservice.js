const userServiceFake = require('../services/user-service.js')
const EncryptHelper = require('../helpers/EncryptHelper.js')


class UserService {
  async registerUser(email, password) {
    const verifyExistsUser = await userServiceFake.findOne({ email })
      
    if (verifyExistsUser) throw new Error()
    
    const hashPass = await EncryptHelper.hash(password)      
    
    const user = await userServiceFake.createOne({ email, hashPass })
    return user
  }
}

module.exports = UserService