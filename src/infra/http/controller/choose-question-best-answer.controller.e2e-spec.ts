import { AppModule } from '@/infra/app.module'
import { CryptographyModule } from '@/infra/cryptography/cryptography.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-user'
import { AnswerFactory } from './../../../../test/factories/make-answer'

describe('ChooseQuestionBestAnswerController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let answerFactory: AnswerFactory
  let jwtService: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, CryptographyModule, DatabaseModule],
      providers: [
        PrismaService,
        StudentFactory,
        QuestionFactory,
        AnswerFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    answerFactory = moduleRef.get(AnswerFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /answers/:answerId/choose-as-best-answer', async () => {
    const studentWhoAsked = await studentFactory.makeStudent()
    const studentWhoAnswered = await studentFactory.makeStudent()
    const token = jwtService.sign({ sub: studentWhoAsked.id.toValue() })
    const question = await questionFactory.makePrismaQuestion({
      authorId: studentWhoAsked.id,
    })
    const answer = await answerFactory.makePrismaAnswer({
      authorId: studentWhoAnswered.id,
      questionId: question.id,
    })

    const response = await request(app.getHttpServer())
      .patch(`/answers/${answer.id.toValue()}/choose-as-best-answer`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(204)

    const questionOnDatabase = await prisma.question.findUnique({
      where: { id: question.id.toValue() },
    })

    expect(questionOnDatabase?.bestAnswerId).toEqual(answer.id.toValue())
  })
})
