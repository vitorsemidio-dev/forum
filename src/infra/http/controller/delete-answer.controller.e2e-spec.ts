import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('DeleteAnswerController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory
  let jwtServicie: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        PrismaService,
        StudentFactory,
        AnswerFactory,
        JwtService,
        QuestionFactory,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    jwtServicie = moduleRef.get(JwtService)
    answerFactory = moduleRef.get(AnswerFactory)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  test('[DELETE] /answers/:id', async () => {
    const user = await studentFactory.makeStudent()
    const token = jwtServicie.sign({ sub: user.id.toString() })
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })
    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    })

    const response = await request(app.getHttpServer())
      .delete(`/answers/${answer.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(204)

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        id: answer.id.toString(),
      },
    })

    expect(answerOnDatabase).toBeFalsy()
  })
})
