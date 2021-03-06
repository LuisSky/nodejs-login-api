const { UnauthorizedError } = require('../errors')

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
      body: error
    }
  }

  static validResponse (body) {
    return {
      statusCode: 200,
      body: body
    }
  }

  static resourceCreated (body) {
    return {
      statusCode: 201,
      body: body
    }
  }
}
