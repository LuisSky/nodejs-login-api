import { UnauthorizedError } from '../errors'

export default class HttpResponse {
  static badRequest (error: Error) {
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

  static serverError (error: Error) {
    return {
      statusCode: 500,
      body: error
    }
  }

  static validResponse (body: any) {
    return {
      statusCode: 200,
      body: body
    }
  }

  static resourceCreated (body: any) {
    return {
      statusCode: 201,
      body: body
    }
  }
}
