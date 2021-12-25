let users = []


const createOne = (user) => {
  users.push(user)
  
  console.log(users)
  return true
}

const findOne = (findUser) => {

  
  return users.find((user) => user.email == findUser.email)
  
  // return false
}

module.exports = { findOne, createOne }