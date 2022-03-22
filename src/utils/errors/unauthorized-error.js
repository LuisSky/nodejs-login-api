module.exports = class UnauthorizedError extends Error {
  constructor (message) {
    super('Unauthorized')
    this.name = message
  }
}
