export interface Encrypter {
  hash: (pass: string) => string
  compare: (hashPass: string, password: string) => any
}
