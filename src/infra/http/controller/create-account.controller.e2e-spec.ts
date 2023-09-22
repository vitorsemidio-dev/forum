import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory, makeUser } from 'test/factories/make-user'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService, UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)

    await app.init()
  })

  test('[POST] /accounts', async () => {
    const user = makeUser()
    const response = await request(app.getHttpServer())
      .post('/accounts')
      .send(user)

    expect(response.statusCode).toBe(201)

    const userOnDatabase = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    })

    expect(userOnDatabase).toBeTruthy()
    expect(userOnDatabase?.password).toBeDefined()
    expect(userOnDatabase?.password).not.toBe(user.password)
  })
})
