import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('GetQuestionBySlugController (e2e)', () => {
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

  test('[GET] /questions/:slug', async () => {
    const student = await studentFactory.makeStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    const response = await request(app.getHttpServer()).get(
      `/questions/${question.slug.value}`,
    )

    expect(response.statusCode).toBe(200)
    expect(response.body).toEqual(
      expect.objectContaining({
        id: question.id.toValue(),
        title: question.title,
        slug: question.slug.value,
      }),
    )
  })
})
