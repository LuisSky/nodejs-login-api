const userServiceFake = require('../services/user-service.js')

const signup = (req, res) => {
  try {
    const {email, password} = req.body
    
    if (!email || !password) throw new Error()
    
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
    
    if (!email || !password) throw new Error()
    
    const user = await userServiceFake.findOne({ email })
    
    if(!user) return res.status(400).send({ error: "invalid user"})
    return res.status(200).send({ token: 'Fake Token'})
  }
  catch(err) {
    return res.status(400).send({ error: "invalid request"})
  }
}


module.exports = {signup, signin}