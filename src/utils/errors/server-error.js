module.exports = class ServerError extends Error {
  constructor (msg) {
    super(msg)
    this.name = 'ServerError'
  }
}
