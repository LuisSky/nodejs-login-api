import { ICreateUserRepository } from '../../data/protocols/create-user-repository'
import { ILoadUserByEmailRepository } from '../../data/protocols/load-user-by-email-repository'
import { User } from '../../domain/entities/user'
import { PrismaService } from '../../main/config/database/prisma-connection'

export class PostgresUserRepository implements ICreateUserRepository, ILoadUserByEmailRepository {
  private readonly prisma: PrismaService = PrismaService.getInstance()
  async createOne (data: User): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password
      }
    })
    return user
  }

  async findByEmail (email: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } })
    return user
  }
}