import { IHttpServer } from '../../utils/protocols/http-server'
import env from './env'

export default class App {
  constructor (
    private readonly dbConnection: any,
    private readonly httpServer: IHttpServer
  ) {}

  async startApplication (): Promise<void> {
    await this.dbConnection.connect()
    this.httpServer.listen(env.PORT as number)
  }
}
