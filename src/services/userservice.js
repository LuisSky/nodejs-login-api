const userServiceFake = require('../services/user-service.js')
const EncryptHelper = require('../helpers/EncryptHelper.js')
const ValidationError = require('../helpers/errors/validation-error.js')

class UserService {
  async registerUser(email, password) {
    const verifyExistsUser = await userServiceFake.findOne({ email })
      
    if (verifyExistsUser) throw new ValidationError('this user alread exist')
    
    const hashPass = await EncryptHelper.hash(password)      
    
    const user = await userServiceFake.createOne({ email, hashPass })
    return user
  }
}

module.exports = UserService