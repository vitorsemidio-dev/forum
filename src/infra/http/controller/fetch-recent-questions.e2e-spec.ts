import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-user'

describe('FetchRecentQuestionsController (e2e)', () => {
  let app: INestApplication
  let questionFactory: QuestionFactory
  let studentFactory: StudentFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [QuestionFactory, StudentFactory],
    }).compile()

    app = moduleRef.createNestApplication()
    questionFactory = moduleRef.get(QuestionFactory)
    studentFactory = moduleRef.get(StudentFactory)

    await app.init()
  })

  test('[GET] /questions', async () => {
    const student = await studentFactory.makeStudent()
    const promises = Array.from({ length: 3 }).map(() => {
      return questionFactory.makePrismaQuestion({
        authorId: student.id,
      })
    })
    const [question1, question2, question3] = await Promise.all(promises)

    const response = await request(app.getHttpServer()).get('/questions')

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: question1.id,
          title: question1.title,
          slug: question1.slug,
        }),
        expect.objectContaining({
          id: question2.id,
          title: question2.title,
          slug: question2.slug,
        }),
        expect.objectContaining({
          id: question3.id,
          title: question3.title,
          slug: question3.slug,
        }),
      ]),
    )
  })
})
