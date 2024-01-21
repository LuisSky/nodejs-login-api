import { ServerError, UnauthorizedError } from '../errors'
import { IHttpResponse } from '../protocols'

export class HttpHelper {
  static badRequest (error: Error): IHttpResponse {
    return {
      statusCode: 400,
      body: error
    }
  }

  static unauthorized (): IHttpResponse {
    return {
      statusCode: 401,
      body: new UnauthorizedError()
    }
  }

  static serverError (error: Error): IHttpResponse {
    return {
      statusCode: 500,
      body: new ServerError(error.message)
    }
  }

  static validResponse (body: any): IHttpResponse {
    return {
      statusCode: 200,
      body
    }
  }

  static resourceCreated (body: any): IHttpResponse {
    return {
      statusCode: 201,
      body
    }
  }
}
