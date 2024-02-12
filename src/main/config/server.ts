import { IHttpServer } from '../../utils/protocols/http-server'

export default class Server {
  constructor (
    private readonly database: any,
    private readonly app: IHttpServer) {}

  start (port: number) {
    this.database.connect()
    this.app.listen(port)
  }
}
