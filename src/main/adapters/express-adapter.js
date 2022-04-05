
class ExpressAdapter {
  static adapt (route) {
    return async (req, res) => {
      const httpRequest = {
        body: req.body
      }
      const httpResponse = await route.route(httpRequest)
      return res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}

module.exports = ExpressAdapter
