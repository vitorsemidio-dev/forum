import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory, makeQuestion } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-user'

describe('EditQuestionController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwtService: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, JwtService, PrismaService],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /questions/:id', async () => {
    const student = await studentFactory.makeStudent()
    const token = jwtService.sign({ sub: student.id.toString() })
    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })
    const questionUpdate = makeQuestion()

    const response = await request(app.getHttpServer())
      .put(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: questionUpdate.title,
        content: questionUpdate.content,
      })

    expect(response.statusCode).toBe(204)

    const questionOnDatabase = await prisma.question.findUnique({
      where: {
        id: question.id.toString(),
      },
    })

    expect(questionOnDatabase?.title).toBe(questionUpdate.title)
    expect(questionOnDatabase?.content).toBe(questionUpdate.content)
    expect(questionOnDatabase?.slug).toBe(
      Slug.createFromText(questionUpdate.title).value,
    )
  })
})
