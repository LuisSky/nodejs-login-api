import bcrypt from 'bcrypt'
import { IEncryptHelper } from '../protocols'

export class EncryptHelper implements IEncryptHelper {
  hash (str: string): null | string {
    if (!str) return null
    return bcrypt.hashSync(str, 10)
  }

  compare (str: string, hashString: string) {
    return bcrypt.compare(str, hashString)
  }
}
