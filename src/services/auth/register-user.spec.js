const RegisterUserService = require('./register-user.js')
const { MissingParamError } = require('../../helpers/errors')
// const makeSut = () => {
//   return new UserService()
// }

describe('UserService', () => {
  it('Should throw if no UserRepository is provided', async () => {
    const sut = new RegisterUserService()
    const promise = sut.execute('any_mail@mail.com', 'any_pass')
    expect(promise).rejects.toThrowError(new MissingParamError('UserRepository'))
  })
})
