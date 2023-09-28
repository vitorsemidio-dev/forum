import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { StudentFactory } from 'test/factories/make-student'

describe('CommentOnQuestionController', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [StudentFactory, QuestionFactory, PrismaService],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    studentFactory = moduleRef.get(StudentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[POST] /questions/:questionId/comments', async () => {
    const userWhoAsked = await studentFactory.makeStudent()
    const userWhoCommented = await studentFactory.makeStudent()
    const accessToken = jwt.sign({
      sub: userWhoCommented.id.toString(),
    })
    const question = await questionFactory.makePrismaQuestion({
      authorId: userWhoAsked.id,
    })

    const comment = makeQuestionComment({
      authorId: userWhoCommented.id,
      questionId: question.id,
    })

    const response = await request(app.getHttpServer())
      .post(`/questions/${question.id.toString()}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: comment.content,
      })

    expect(response.statusCode).toBe(201)

    const commentOnDatabase = await prisma.comment.findFirst({
      where: {
        content: comment.content,
      },
    })

    expect(commentOnDatabase).toBeTruthy()
  })
})
