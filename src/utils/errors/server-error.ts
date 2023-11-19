export default class ServerError extends Error {
  constructor (private readonly error: string) {
    super(error)
    this.name = 'ServerError'
  }
}
