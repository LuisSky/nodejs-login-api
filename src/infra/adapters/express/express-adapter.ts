import { IHttpServer } from '../../../utils/protocols/http-server'
import { IController, IHttpResponse } from '../../../utils/protocols'
import express, { type Response, type Request } from 'express'

export class ExpressAdapter implements IHttpServer {
  private readonly server: any

  constructor () {
    this.server = express()
    this.server.use(express.json())
  }

  listen (port: number): void {
    this.server.listen(port, () => {
      console.log(`server runnning at http://localhost:${port}`)
    })
  }

  addRoute (method: string, url: string, controller: IController) {
    this.server[method](url, async (req: Request, res: Response) => {
      const httpRequest = {
        body: req.body
      }
      const httpResponse: IHttpResponse = await controller.handle(httpRequest)
      return res.status(httpResponse.statusCode).json(httpResponse.body)
    })
  }
}
