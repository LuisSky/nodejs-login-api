import { PrismaClient } from '@prisma/client'

export class PrismaService extends PrismaClient {
  private static instance: PrismaClient

  public static getInstance (): PrismaClient {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaClient()
    }

    return PrismaService.instance
  }
}
