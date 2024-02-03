import { PrismaClient } from '@prisma/client'

export class PrismaAdapter {
  static prisma = new PrismaClient()

  static async connect (): Promise<void> {
    try {
      await PrismaAdapter.prisma.$connect()
    } catch (_) {
      console.log('Error to connect to Database')
    }
  }
}
