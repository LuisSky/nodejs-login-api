module.exports = class ServerError extends Error {
  constructor(name){
    super('internal error')
    this.name = 'internal error'
  }
  
}