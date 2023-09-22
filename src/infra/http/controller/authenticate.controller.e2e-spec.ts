import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { AppModule } from '@/infra/app.module'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { UserFactory } from 'test/factories/make-user'

describe('Authenticate (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let hashGenerator: HashGenerator

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, CryptographyModule],
      providers: [PrismaService, UserFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    hashGenerator = moduleRef.get(HashGenerator)

    await app.init()
  })
  test('[POST] /sessions', async () => {
    const userDB = await userFactory.makeUser({
      password: await hashGenerator.hash('123456'),
    })

    const response = await request(app.getHttpServer()).post('/sessions').send({
      email: userDB.email,
      password: '123456',
    })

    expect(response.statusCode).toBe(201)
    expect(response.body).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
      }),
    )
  })
})
