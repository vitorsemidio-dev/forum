import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory, makeQuestion } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('DeleteQuestionController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwtServicie: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [PrismaService, StudentFactory, QuestionFactory, JwtService],
    }).compile()

    app = moduleRef.createNestApplication()
    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    jwtServicie = moduleRef.get(JwtService)
    questionFactory = moduleRef.get(QuestionFactory)

    await app.init()
  })

  test('[DELETE] /questions/:id - should delete a question', async () => {
    const user = await studentFactory.makeStudent()
    const token = jwtServicie.sign({ sub: user.id.toString() })
    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    })

    const response = await request(app.getHttpServer())
      .delete(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.statusCode).toBe(204)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        id: question.id.toString(),
      },
    })

    expect(questionOnDatabase).toBeFalsy()
  })

  test('[DELETE] /questions/:id - should not delete question if user is not the author', async () => {
    const author = await studentFactory.makeStudent()
    const user = await studentFactory.makeStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: author.id,
    })
    const token = jwtServicie.sign({ sub: user.id.toString() })

    const response = await request(app.getHttpServer())
      .delete(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        id: question.id.toString(),
      },
    })
    expect(questionOnDatabase).toBeTruthy()
    expect(response.statusCode).toBe(403)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Not allowed.',
        error: 'Forbidden',
        statusCode: 403,
      }),
    )
  })

  test('[DELETE] /questions/:id - should not delete question if question does not exist', async () => {
    const author = await studentFactory.makeStudent()
    const question = makeQuestion({
      authorId: author.id,
    })
    const token = jwtServicie.sign({ sub: author.id.toString() })

    const response = await request(app.getHttpServer())
      .delete(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        id: question.id.toString(),
      },
    })
    expect(questionOnDatabase).toBeFalsy()
    expect(response.statusCode).toBe(404)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Question not found.',
        error: 'Not Found',
        statusCode: 404,
      }),
    )
  })

  test('[DELETE] /questions/:id - should not delete question if user is not authenticated', async () => {
    const author = await studentFactory.makeStudent()
    const question = await questionFactory.makePrismaQuestion({
      authorId: author.id,
    })

    const response = await request(app.getHttpServer()).delete(
      `/questions/${question.id.toString()}`,
    )

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        id: question.id.toString(),
      },
    })
    expect(questionOnDatabase).toBeTruthy()
    expect(response.statusCode).toBe(401)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Unauthorized',
        statusCode: 401,
      }),
    )
  })
})
