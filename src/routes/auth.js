const userServiceFake = require('../services/user-service.js')
const { UnauthorizedError } = require('../helpers/errors')

const signup = (req, res) => {
  try {
    const {email, password} = req.body
    
    if (!email || !password) throw new UnauthorizedError()
    
    userServiceFake.createOne({ email, password })
    
    return res.status(201).send({ title: 'User created', email, password})
  }
  catch(err) {
    return res.status(400).send({ error: 'invalid request'})
  }
}

const signin = async (req, res) => {
  try {
    const {email, password} = req.body
    
    const user = await userServiceFake.findOne({ email })
    
    if(!user) throw new UnauthorizedError()
    
    return res.status(200).send({ token: 'Fake Token'})
  }
  catch(err) {
    return res.status(400).send({ error: "invalid request"})
  }
}


module.exports = {signup, signin}