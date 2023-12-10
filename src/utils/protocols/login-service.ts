export interface ILoginService {
  verifyLogin(email: string, password: string): Promise<null | any>
}