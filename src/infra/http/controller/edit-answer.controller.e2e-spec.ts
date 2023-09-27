import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory, makeAnswer } from 'test/factories/make-answer'
import { AnswerAttachmentFactory } from 'test/factories/make-answer-attachment'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('EditAnswerController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let answerFactory: AnswerFactory
  let questionFactory: QuestionFactory
  let jwtService: JwtService
  let attachmentFactory: AttachmentFactory
  let answerAttachmentFactory: AnswerAttachmentFactory

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        StudentFactory,
        AttachmentFactory,
        AnswerAttachmentFactory,
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
    attachmentFactory = moduleRef.get(AttachmentFactory)
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory)
    jwtService = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PUT] /answers/:id', async () => {
    const [studentWhoAsked, studentWhoAnswered] =
      await studentFactory.makeManyStudent(2)
    const token = jwtService.sign({
      sub: studentWhoAnswered.id.toString(),
    })
    const question = await questionFactory.makePrismaQuestion({
      authorId: studentWhoAsked.id,
    })
    const answer = await answerFactory.makePrismaAnswer({
      authorId: studentWhoAnswered.id,
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

  test('[PUT] /answers/:id', async () => {
    const [studentWhoAsked, studentWhoAnswered] =
      await studentFactory.makeManyStudent(2)
    const token = jwtService.sign({
      sub: studentWhoAnswered.id.toString(),
    })
    const question = await questionFactory.makePrismaQuestion({
      authorId: studentWhoAsked.id,
    })
    const answer = await answerFactory.makePrismaAnswer({
      authorId: studentWhoAnswered.id,
      questionId: question.id,
    })
    const answerUpdate = makeAnswer()

    const [attachment1, attachment2, attachment3] =
      await attachmentFactory.makeManyPrismaAttachment(3)
    await answerAttachmentFactory.makePrismaAnswerAttachment({
      answerId: answer.id,
      attachmentId: attachment1.id,
    })
    await answerAttachmentFactory.makePrismaAnswerAttachment({
      answerId: answer.id,
      attachmentId: attachment2.id,
    })

    const response = await request(app.getHttpServer())
      .put(`/answers/${answer.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        content: answerUpdate.content,
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      })

    expect(response.statusCode).toBe(204)

    const answerOnDatabase = await prisma.answer.findUnique({
      where: {
        id: answer.id.toString(),
      },
    })

    expect(answerOnDatabase).toBeTruthy()

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answer.id.toString(),
      },
    })

    expect(attachmentsOnDatabase).toHaveLength(2)
    expect(attachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toString(),
        }),
        expect.objectContaining({
          id: attachment3.id.toString(),
        }),
      ]),
    )
  })
})
