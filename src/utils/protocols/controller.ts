import HttpRequest from "./http-request";

export interface Controller {
  handle(httpRequest: HttpRequest<any>): Promise<any>
}