const { ServerError, UnauthorizedError } = require('../../utils/errors')

module.exports = class HttpResponse {
  static badRequest (error) {
    return {
      statusCode: 400,
      body: error
    }
  }

  static unauthorized () {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
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
