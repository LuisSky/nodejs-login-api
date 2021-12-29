
module.exports = class SigninRoute {
  async route (httpRequest) => {
    try {
      const {email, password} = httpRequest.body
      
      const user = await userServiceFake.findOne({ email })
      
      if(!user) throw new UnauthorizedError()
      
      return {
        statusCode: 200,
        body: {
          token: 'Fake Token'
        }
      }
    }
    catch(err) {
      return {
        statusCode: 400,
        body: {
          error: "invalid request"
        }
      }
    }
  }
}