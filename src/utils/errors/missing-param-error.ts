export default class MissingParamError extends Error {
  constructor (private readonly error: string) {
    super(error)  
  }
}
