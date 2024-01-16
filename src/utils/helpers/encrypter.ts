import bcrypt from 'bcrypt'
import { Encrypter } from '../protocols'

export class EncrypterHelper implements Encrypter {
  hash (str: string): string {
    return bcrypt.hashSync(str, 10)
  }

  async compare (str: string, hashString: string) {
    return await bcrypt.compare(str, hashString)
  }
}
