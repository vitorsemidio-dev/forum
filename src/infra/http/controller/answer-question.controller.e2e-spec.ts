import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { makeAnswer } from 'test/factories/make-answer'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('AnswerQuestionController (e2e)', () => {
  let app: INestApplication
  let jwtService: JwtService
  let studentFactory: StudentFactory
  let attachmentFactory: AttachmentFactory
  let questionFactory: QuestionFactory
  let prisma: PrismaService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      controllers: [],
      providers: [
        AttachmentFactory,
        JwtService,
        StudentFactory,
        QuestionFactory,
        PrismaService,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    jwtService = moduleRef.get(JwtService)
    studentFactory = moduleRef.get(StudentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    questionFactory = moduleRef.get(QuestionFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[POST] /answer-question/:questionId', async () => {
    const [studentWhoAsked, studentWhoAnswered] =
      await studentFactory.makeManyStudent(2)
    const token = jwtService.sign({
      sub: studentWhoAnswered.id.toString(),
    })
    const question = await questionFactory.makePrismaQuestion({
      authorId: studentWhoAsked.id,
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
    expect(answerOnDatabase?.authorId).toBe(studentWhoAnswered.id.toString())
    expect(answerOnDatabase?.content).toBe(answer.content)
    expect(answerOnDatabase?.questionId).toBe(question.id.toString())
  })

  test('[POST] /answer-question/:questionId', async () => {
    const [studentWhoAsked, studentWhoAnswered] =
      await studentFactory.makeManyStudent(2)
    const token = jwtService.sign({ sub: studentWhoAnswered.id.toString() })
    const question = await questionFactory.makePrismaQuestion({
      authorId: studentWhoAsked.id,
    })
    const answer = makeAnswer()
    const [attachment1, attachment2] =
      await attachmentFactory.makeManyPrismaAttachment(2)

    const response = await request(app.getHttpServer())
      .post(`/answer-question/${question.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: answer.content,
        attachments: [attachment1.id.toString(), attachment2.id.toString()],
      })

    expect(response.statusCode).toBe(201)

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: answer.content,
      },
    })

    expect(answerOnDatabase).toBeTruthy()

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answerOnDatabase?.id,
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString(),
        }),
        expect.objectContaining({
          id: attachment2.id.toString(),
        }),
      ]),
    )
  })
})
