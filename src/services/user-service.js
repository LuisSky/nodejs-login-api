const EncryptHelper = require('../helpers/EncryptHelper.js')
const { ValidationError, UnauthorizedError } = require('../helpers/errors')
const UserRepository = require('../repository/user-repository.js')


class UserService {
  async registerUser(email, password) {
  
    if(!email) throw new ValidationError('email is obrigatory')
    if(!password) throw new ValidationError('password is obrigatory')
    
    const userRepository = new UserRepository()
    const verifyExistsUser = await userRepository.findOne({ email })
      
    if (verifyExistsUser) throw new ValidationError('this user alread exist')
    
    const hashPass = await EncryptHelper.hash(password)      
    
    const user = await userRepository.createOne({ email, hashPass })
    return user
  }
  
  async verifyLogin(email, password) {
    
    if(!email) throw new ValidationError('email is obrigatory')
    if(!password) throw new ValidationError('password is obrigatory')
    
    const userRepository = new UserRepository()
    const user = await userRepository.findOne({ email })
    
    if(!user) throw new UnauthorizedError('Invalid user or password')
    
    const passwordCompare = await EncryptHelper.compare(password, user.password)
    if(!passwordCompare) throw new UnauthorizedError('Invalid user or password')
    
    return user
  }
}

module.exports = UserService