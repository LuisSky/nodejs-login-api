import { Response, Request } from 'express'
import { IController, IHttpResponse } from '../../utils/protocols'

export default class ExpressAdapter {
  static adapt (controller: IController) {
    return async (req: Request, res: Response): Promise<Response> => {
      const httpRequest = {
        body: req.body
      }
      const httpResponse: IHttpResponse = await controller.handle(httpRequest)
      return res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}
