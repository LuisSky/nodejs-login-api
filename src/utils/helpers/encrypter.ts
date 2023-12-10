import bcrypt from 'bcrypt'
import { Encrypter } from '../protocols'

export class EncrypterHelper implements Encrypter {
  hash (str: string): null | string {
    if (!str) return null
    return bcrypt.hashSync(str, 10)
  }

  compare (str: string, hashString: string) {
    return bcrypt.compare(str, hashString)
  }
}
