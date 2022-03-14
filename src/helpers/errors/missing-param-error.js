module.exports = class MissingParamError extends Error {
  constructor (message) {
    super('MissingParamError')
    this.error = message
    this.statusCode = 400
  }
}
