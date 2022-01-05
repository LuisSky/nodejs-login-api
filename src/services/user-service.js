let users = []

const createOne = (user) => {
  const saveUser = { email: user.email, password: user.hashPass }
  users.push(saveUser)
  return saveUser
}  

const findOne = (findUser) => users.find((user) => user.email == findUser.email)

const findAll = () => users

module.exports = { findOne, createOne, findAll }