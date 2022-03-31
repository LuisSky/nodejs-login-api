module.exports = class ValidationError extends Error {
  constructor (param) {
    super(param)
    this.error = param
  }
}
