import { User } from '../../domain/entities/user'

export interface ILoadUserByEmailRepository {
  findByEmail: (email: string) => Promise<User | null>
}
