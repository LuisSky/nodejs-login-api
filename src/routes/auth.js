const signup = (req, res) => {
  try {
    const {email, password} = req.body
    
    if (!email || !password) throw new Error()
    
    return res.status(201).send({ title: 'User created', email, password})
  }
  catch(err) {
    return res.status(400).send({ error: 'bad request'})
  }
}

const signin = (req, res) => {
  const {email, password} = req.body
  
  if (!email || !password) return res.status(400).send({ error: 'invalid login error'})
  return res.status(200).send({ token: 'Fake Token'})
}


module.exports = {signup, signin}