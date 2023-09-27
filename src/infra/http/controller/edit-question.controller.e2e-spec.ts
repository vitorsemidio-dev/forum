import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory, makeQuestion } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'
import { StudentFactory } from 'test/factories/make-student'

describe('EditQuestionController (e2e)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let studentFactory: StudentFactory
  let questionFactory: QuestionFactory
  let questionAttachmentFactory: QuestionAttachmentFactory
  let attachmentFactory: AttachmentFactory
  let jwtService: JwtService

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AttachmentFactory,
        QuestionAttachmentFactory,
        StudentFactory,
        QuestionFactory,
        JwtService,
        PrismaService,
      ],
    }).compile()

    app = moduleRef.createNestApplication()
    questionAttachmentFactory = moduleRef.get(QuestionAttachmentFactory)
    attachmentFactory = moduleRef.get(AttachmentFactory)
    jwtService = moduleRef.get(JwtService)
    questionFactory = moduleRef.get(QuestionFactory)
    studentFactory = moduleRef.get(StudentFactory)
    prisma = moduleRef.get(PrismaService)

    await app.init()
  })

  test('[PUT] /questions/:id', async () => {
    const student = await studentFactory.makeStudent()
    const token = jwtService.sign({ sub: student.id.toString() })
    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })
    const questionUpdate = makeQuestion()

    const response = await request(app.getHttpServer())
      .put(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: questionUpdate.title,
        content: questionUpdate.content,
      })

    expect(response.statusCode).toBe(204)

    const questionOnDatabase = await prisma.question.findUnique({
      where: {
        id: question.id.toString(),
      },
    })

    expect(questionOnDatabase?.title).toBe(questionUpdate.title)
    expect(questionOnDatabase?.content).toBe(questionUpdate.content)
    expect(questionOnDatabase?.slug).toBe(
      Slug.createFromText(questionUpdate.title).value,
    )
  })

  test('[PUT] /questions/:id', async () => {
    const student = await studentFactory.makeStudent()
    const token = jwtService.sign({ sub: student.id.toString() })

    const attachment1 = await attachmentFactory.makePrismaAttachment()
    const attachment2 = await attachmentFactory.makePrismaAttachment()
    const attachment3 = await attachmentFactory.makePrismaAttachment()

    const question = await questionFactory.makePrismaQuestion({
      authorId: student.id,
    })

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment1.id,
      questionId: question.id,
    })

    await questionAttachmentFactory.makePrismaQuestionAttachment({
      attachmentId: attachment2.id,
      questionId: question.id,
    })

    const questionUpdate = makeQuestion()

    const response = await request(app.getHttpServer())
      .put(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: questionUpdate.title,
        content: questionUpdate.content,
        attachments: [attachment1.id.toString(), attachment3.id.toString()],
      })

    expect(response.statusCode).toBe(204)

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: question.id.toString(),
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
