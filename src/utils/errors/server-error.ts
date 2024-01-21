export class ServerError extends Error {
  constructor (stack: string = 'No stack is provided') {
    super('Internal server error')
    this.name = 'ServerError'
    this.stack = stack
  }
}
