const signup = (req, res) => {
  try {
    const {email, password} = req.body
    
    if (!email || !password) throw new Error()
    
    return res.status(201).send({ title: 'User created', email, password})
  }
  catch(err) {
    return res.status(400).send({ error: 'invalid request'})
  }
}

const signin = (req, res) => {
  try {
    const {email, password} = req.body
    
    if (!email || !password) throw new Error()
    
    return res.status(200).send({ token: 'Fake Token'})
  }
  catch(err) {
    return res.status(400).send({ error: "invalid request"})
  }
}


module.exports = {signup, signin}