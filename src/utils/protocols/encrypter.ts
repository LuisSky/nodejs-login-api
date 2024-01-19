export interface IEncrypter {
  hash: (pass: string) => string
  compare: (hashPass: string, password: string) => any
}
