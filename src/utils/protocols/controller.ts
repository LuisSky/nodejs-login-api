import HttpRequest from "../helpers/http-request";

export interface Controller {
  handle(httpRequest: HttpRequest<any>): Promise<any>
}