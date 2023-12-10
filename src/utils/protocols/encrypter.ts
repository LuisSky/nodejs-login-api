export interface Encrypter {
  hash(pass: string): any
  compare(hashPass: string, password: string): any
}