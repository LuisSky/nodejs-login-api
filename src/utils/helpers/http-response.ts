import { UnauthorizedError } from '../errors'

export default class HttpResponse {
  static badRequest (error: any) {
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

  static serverError (error: any) {
    return {
      statusCode: 500,
      body: error
    }
  }

  static validResponse (body: object) {
    return {
      statusCode: 200,
      body: body
    }
  }

  static resourceCreated (body: object) {
    return {
      statusCode: 201,
      body: body
    }
  }
}
