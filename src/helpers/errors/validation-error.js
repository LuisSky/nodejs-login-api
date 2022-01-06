module.exports = class ValidationError extends Error {
  constructor (message) {
    super('Validation')
    this.error = message
    this.statusCode = 400
  }
}
