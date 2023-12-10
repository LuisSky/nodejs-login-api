
import { Response, Request } from "express"
import { Controller } from "../../utils/protocols"

export default class ExpressAdapter {
  static adapt (controller: Controller) {
    return async (req: Request, res: Response) => {
      const httpRequest = {
        body: req.body
      }
      const httpResponse = await controller.handle(httpRequest)
      return res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}

