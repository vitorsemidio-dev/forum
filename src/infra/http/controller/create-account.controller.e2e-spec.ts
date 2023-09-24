import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { StudentFactory, makeStudent } from 'test/factories/make-student'

describe('Create Account (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      providers: [PrismaService, StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })

  test('[POST] /accounts', async () => {
    const user = makeStudent()
    const response = await request(app.getHttpServer()).post('/accounts').send({
      name: user.name,
      email: user.email,
      password: user.password,
    })

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
