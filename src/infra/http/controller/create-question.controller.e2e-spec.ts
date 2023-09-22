import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeQuestion } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-user'

describe('CreateQuestionController (e2e)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let hashGenerator: HashGenerator
  let studentFactory: StudentFactory
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, CryptographyModule, DatabaseModule],
      controllers: [],
      providers: [JwtService, StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    jwtService = moduleRef.get(JwtService)
    hashGenerator = moduleRef.get(HashGenerator)
    studentFactory = moduleRef.get(StudentFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /questions', async () => {
    const student = await studentFactory.makeStudent()
    const token = jwtService.sign({ sub: student.id.toString() })
    const question = makeQuestion()

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: question.title,
        content: question.content,
      })

    expect(response.statusCode).toBe(201)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: question.title,
      },
    })

    expect(questionOnDatabase).toBeTruthy()
    expect(questionOnDatabase?.authorId).toBe(student.id.toString())
    expect(questionOnDatabase?.slug).toBe(
      Slug.createFromText(question.title).value,
    )
  })
})
