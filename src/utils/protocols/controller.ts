import { IHttpRequest } from './http-request'
import { IHttpResponse } from './http-response'

export interface IController {
  handle: (httpRequest: IHttpRequest) => Promise<IHttpResponse>
}
