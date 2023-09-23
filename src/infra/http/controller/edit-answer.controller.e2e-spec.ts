import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory, makeAnswer } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-user'

describe('EditAnswerController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory
  let jwtService: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        AnswerFactory,
        QuestionFactory,
        JwtService,
        PrismaService,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /answers/:id', async () => {
    const studentWhoMakeQuestion = await studentFactory.makeStudent()
    const studentWhoAnswerQuestion = await studentFactory.makeStudent()
    const token = jwtService.sign({
      sub: studentWhoAnswerQuestion.id.toString(),
    })
    const question = await questionFactory.makePrismaQuestion({
      authorId: studentWhoMakeQuestion.id,
    })
    const answer = await answerFactory.makePrismaAnswer({
      authorId: studentWhoAnswerQuestion.id,
      questionId: question.id,
    })
    const answerUpdate = makeAnswer()

    const response = await request(app.getHttpServer())
      .put(`/answers/${answer.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: answerUpdate.content,
      })

    expect(response.statusCode).toBe(204)

    const answerOnDatabase = await prisma.answer.findUnique({
      where: {
        id: answer.id.toString(),
      },
    })

    expect(answerOnDatabase).toBeTruthy()
    expect(answerOnDatabase?.content).toBe(answerUpdate.content)
  })
})
