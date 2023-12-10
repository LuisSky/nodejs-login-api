export interface IRegisterUserService {
  execute ({ email, password }: Record<string, string> ): Promise<any>
}