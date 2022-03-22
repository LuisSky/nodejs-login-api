const { ServerError } = require('../../helpers/errors')

module.exports = class HttpResponse {
  static badRequest (error) {
    return {
      statusCode: 400,
      body: error
    }
  }

  static serverError (error) {
    return {
      statusCode: 500,
      body: new ServerError(error)
    }
  }

  static validResponse (body) {
    return {
      statusCode: 200,
      body: body
    }
  }
}
