import { Test } from '@nestjs/testing'
import { AppModule } from '@/infra/app.module'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { JwtService } from '@nestjs/jwt'

describe('Fetch recent questions (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: 'doe123',
      },
    })

    await prisma.question.create({
      data: {
        authorId: user.id,
        title: 'New Question',
        slug: 'new-question',
        content: 'New question content',
      },
    })

    const accessToken = jwt.sign({ sub: user.id })

    const responseRecentQuestions = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(responseRecentQuestions.statusCode).toBe(200)
    expect(responseRecentQuestions.body).toEqual({
      questions: [
        expect.objectContaining({
          slug: 'new-question',
        }),
      ],
    })
  })
})
