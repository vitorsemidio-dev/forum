import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('FetchAnswerQuestionsController (e2e)', () => {
  let app: INestApplication
  let questionFactory: QuestionFactory
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [QuestionFactory, StudentFactory, AnswerFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    questionFactory = moduleRef.get(QuestionFactory)
    studentFactory = moduleRef.get(StudentFactory)
    answerFactory = moduleRef.get(AnswerFactory)

    await app.init()
  })

  test('[GET] /questions/:questionId/answers', async () => {
    const [studentWhoAsked, studentWhoAnswered] =
      await studentFactory.makeManyStudent(2)
    const question = await questionFactory.makePrismaQuestion({
      authorId: studentWhoAsked.id,
    })
    const [answer1, answer2, answer3] =
      await answerFactory.makeManyPrismaAnswer(3, {
        authorId: studentWhoAnswered.id,
        questionId: question.id,
      })

    const response = await request(app.getHttpServer()).get(
      `/questions/${question.id.toString()}/answers`,
    )

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: answer1.id.toValue(),
          content: answer1.content,
        }),
        expect.objectContaining({
          id: answer2.id.toString(),
          content: answer2.content,
        }),
        expect.objectContaining({
          id: answer3.id.toString(),
          content: answer3.content,
        }),
      ]),
    )
  })
})
