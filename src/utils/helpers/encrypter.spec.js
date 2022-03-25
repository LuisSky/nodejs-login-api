
jest.mock('bcrypt', () => {
  return {
    async hashSync (noHashString, number) {
      this.noHashString = noHashString
    }
  }
})

const EncrypterHelper = require('./encrypter')
const bcrypt = require('bcrypt')

const makeSut = () => {
  return new EncrypterHelper()
}

describe('EncrypterHelper', () => {
  test('Should calls bcrypt with correct params', async () => {
    const sut = makeSut()
    await sut.hash('any_string')
    expect(bcrypt.noHashString).toBe('any_string')
  })
})
