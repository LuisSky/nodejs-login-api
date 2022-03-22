module.exports = class MissingParamError extends Error {
  constructor (param) {
    super(param)
    this.error = param
  }
}
