import { Test } from '@nestjs/testing'
import { AppModule } from '@/app.module'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@/prisma/prisma.service'

describe('Create account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /account', async () => {
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'doe123',
    })

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: { email: 'johndoe@example.com' },
    })

    expect(userOnDatabase).toBeTruthy()
  })
})
