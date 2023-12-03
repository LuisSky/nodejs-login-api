export interface ITokenGenerator {
  generate: (payload: object) => any,
  decode: (token: string) => any
}