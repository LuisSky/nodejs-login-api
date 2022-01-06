let users = []

class UserRepository {
  createOne(user) {
    const saveUser = { email: user.email, password: user.hashPass }
    users.push(saveUser)
    return saveUser
  }
  findOne(findUser) {
    return users.find((user) => user.email == findUser.email)
  }
  findAll() {
    return users
  }  
}


module.exports = UserRepository