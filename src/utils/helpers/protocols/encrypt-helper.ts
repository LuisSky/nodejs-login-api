export type IEncryptHelper = {
  hash: (pass: string) => any,
  compare: (hashPass: string, password: string) => any
}