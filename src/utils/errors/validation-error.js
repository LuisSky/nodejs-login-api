module.exports = class ValidationError extends Error {
  constructor (message) {
    super('ValidationError')
    this.error = message
  }
}
