const signup = (req, res) => {
  const {email, password} = req.body
  
  return res.status(201).send({ title: 'User created', email, password})
}


module.exports = {signup}