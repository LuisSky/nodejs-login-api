// export const hashSync = jest.fn().mockReturnValue('hashedPassword');
// export const compare = jest.fn().mockReturnValue(true);

class bcrypt {
  hashParam = ''
  validHashString = true
  hashSync = jest.fn().mockImplementation((str) => {
    this.hashParam = str
    return 'any_hash'
  })
  compare = jest.fn().mockImplementation((noHashStr: string, hashStr: string) => {
    return this.validHashString
  })
}


// const bcrypt = {
//   hashParam: '',
//   hashSync: jest.fn().mockImplementation((str) => {
//     this.hashParam = str
//     return 'any_hash'
//   }),
//   compare: jest.fn().mockReturnValue(true)
// }

export default new bcrypt()