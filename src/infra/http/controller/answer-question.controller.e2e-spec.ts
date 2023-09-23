import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeAnswer } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-user'

describe('AnswerQuestionController (e2e)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      controllers: [],
      providers: [JwtService, StudentFactory, QuestionFactory, PrismaService],
    }).compile()

    app = moduleRef.createNestApplication()
    jwtService = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /answer-question/:questionId', async () => {
    const studentWhoMakeQuestion = await studentFactory.makeStudent()
    const studentWhoAnswerQuestion = await studentFactory.makeStudent()
    const token = jwtService.sign({
      sub: studentWhoAnswerQuestion.id.toString(),
    })
    const question = await questionFactory.makePrismaQuestion({
      authorId: studentWhoMakeQuestion.id,
    })
    const answer = makeAnswer()

    const response = await request(app.getHttpServer())
      .post(`/answer-question/${question.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: answer.content,
      })

    expect(response.statusCode).toBe(201)

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        questionId: question.id.toString(),
      },
    })

    expect(answerOnDatabase).toBeTruthy()
    expect(answerOnDatabase?.authorId).toBe(
      studentWhoAnswerQuestion.id.toString(),
    )
    expect(answerOnDatabase?.content).toBe(answer.content)
    expect(answerOnDatabase?.questionId).toBe(question.id.toString())
  })
})
