export class UnauthorizedError extends Error {
  constructor (message: string = 'UnauthorizedError') {
    super('Unauthorized')
    this.name = message
  }
}
