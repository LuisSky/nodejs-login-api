import { ICreateUserRepository } from '../../data/protocols/create-user-repository'
import { ILoadUserByEmailRepository } from '../../data/protocols/load-user-by-email-repository'
import { User } from '../../domain/entities/user'
import { PrismaAdapter } from '../adapters/db/prisma-adapter'

export class PostgresUserRepository implements ICreateUserRepository, ILoadUserByEmailRepository {
  async createOne (data: User): Promise<User> {
    const user = await PrismaAdapter.prisma.user.create({
      data: { ...data }
    })
    return user
  }

  async findByEmail (email: string): Promise<any> {
    const user = await PrismaAdapter.prisma.user.findUnique({ where: { email } })
    return user
  }
}
