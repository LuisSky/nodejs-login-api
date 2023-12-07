
import { Response } from "express"
import { httpRequest, httpResponse } from "../../domain/services/auth/interfaces"


export default class ExpressAdapter {
  static adapt (route: any) {
    return async (req: httpRequest, res: Response) => {
      const httpRequest = {
        body: req.body
      }
      const httpResponse: httpResponse = await route.route(httpRequest)
      return res.status(httpResponse.statusCode).json(httpResponse.body)
    }
  }
}

