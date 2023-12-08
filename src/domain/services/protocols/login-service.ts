export default interface ILoginService {
  verifyLogin(email: string, password: string): Promise<null | any>
}