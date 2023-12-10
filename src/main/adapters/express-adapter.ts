
import { Response } from "express"
import { httpRequest, httpResponse } from "../../domain/services/auth/interfaces"
import { Controller } from "../../utils/protocols"


export default class ExpressAdapter {
  static adapt (controller: Controller) {
    return async (req: httpRequest, res: Response) => {
      const httpRequest = {
        body: req.body
      }
      const httpResponse: httpResponse = await controller.handle(httpRequest)
      return res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}

