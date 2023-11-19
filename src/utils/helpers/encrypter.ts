import bcrypt from 'bcrypt'
import { IEncryptHelper } from '../../services/auth/interfaces'


export default class EncryptHelper implements IEncryptHelper {
  hash (str: string) {
    return bcrypt.hashSync(str, 10)
  }

  compare (str: string, hashString: string) {
    return bcrypt.compare(str, hashString)
  }
}
