const EncrypterHelper = require('./encrypter')
const bcrypt = require('bcrypt')

jest.mock('bcrypt', () => {
  return {
    async hashSync (noHashString, number) {
      this.noHashString = noHashString
      return 'hash_string'
    },
    async compare (noHashString, hashString) {
      return this.validHashString
    }
  }
})

const makeSut = () => {
  return new EncrypterHelper()
}

describe('EncrypterHelper', () => {
  test('Should calls bcrypt with correct params', async () => {
    const sut = makeSut()
    await sut.hash('any_string')
    expect(bcrypt.noHashString).toBe('any_string')
  })

  test('Should string must be different from the encrypted string', async () => {
    const sut = makeSut()
    const hashString = await sut.hash('any_string')
    expect(hashString).toBe('hash_string')
  })

  test('Should return null if invalid string are provided', async () => {
    const sut = makeSut()
    bcrypt.validHashString = false
    const hashString = await sut.compare('invalid_string', 'valid_hash')
    expect(hashString).toBe(false)
  })
})
