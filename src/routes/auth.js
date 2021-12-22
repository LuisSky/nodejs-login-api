const signup = (req, res) => {
  console.log(req.body)
  const {email, password} = req.body
  
  return res.status(201).send({ title: 'User created', email, password})
}

const signin = (req, res) => {
  console.log(req)
  const {email, password} = req.body
  
  if (!email || !password) return res.status(400).send({ error: 'invalid login error'})
  return res.status(200).send({ token: 'Fake Token'})
}


module.exports = {signup, signin}