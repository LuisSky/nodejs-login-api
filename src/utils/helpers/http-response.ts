import { ServerError, UnauthorizedError } from '../errors'

export class HttpHelper {
  static badRequest (error: Error): any {
    return {
      statusCode: 400,
      body: error
    }
  }

  static unauthorized (): any {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }

  static serverError (error: Error): any {
    return {
      statusCode: 500,
      body: new ServerError(error.message)
    }
  }

  static validResponse (body: any): any {
    return {
      statusCode: 200,
      body
    }
  }

  static resourceCreated (body: any): any {
    return {
      statusCode: 201,
      body
    }
  }
}
