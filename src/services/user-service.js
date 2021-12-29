let users = []

const createOne = (user) =>  users.push(user)
  

const findOne = (findUser) => users.find((user) => user.email == findUser.email)

module.exports = { findOne, createOne }