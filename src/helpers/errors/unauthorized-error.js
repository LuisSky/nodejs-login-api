module.exports = class UnauthorizedError extends Error {
  constructor (message) {
    super('Unauthorized')
    this.error = message
    this.statusCode = 401
  }
}
