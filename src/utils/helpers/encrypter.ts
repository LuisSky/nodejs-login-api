import bcrypt from 'bcrypt'

export default class EncryptHelper {
  hash (str: string): null | string {
    if (!str) return null
    return bcrypt.hashSync(str, 10)
  }

  compare (str: string, hashString: string) {
    return bcrypt.compare(str, hashString)
  }
}
