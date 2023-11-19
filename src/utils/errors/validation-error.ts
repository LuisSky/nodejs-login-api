export default class ValidationError extends Error {
  
  constructor (private readonly error: string) {
    super(error)
  }
}
