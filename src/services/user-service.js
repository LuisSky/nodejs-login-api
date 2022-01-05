let users = []

const createOne = (user) => {
  users.push(user)
  return user
}  

const findOne = (findUser) => users.find((user) => user.email == findUser.email)

const findAll = () => users

module.exports = { findOne, createOne, findAll }