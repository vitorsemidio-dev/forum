import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
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

  test('[DELETE] /questions/:id', async () => {
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
    // Criar dois usuários: um que vai ser o autor da pergunta e outro que vai tentar deletar a pergunta
    const author = await studentFactory.makeStudent()
    const user = await studentFactory.makeStudent()
    // Criar uma pergunta com o usuário que vai ser o autor
    const question = await questionFactory.makePrismaQuestion({
      authorId: author.id,
    })
    // Tentar deletar a pergunta com o usuário que não é o autor
    const token = jwtServicie.sign({ sub: user.id.toString() })
    const response = await request(app.getHttpServer())
      .delete(`/questions/${question.id.toString()}`)
      .set('Authorization', `Bearer ${token}`)
    // Verificar se a pergunta ainda existe no banco de dados
    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        id: question.id.toString(),
      },
    })
    expect(questionOnDatabase).toBeTruthy()
    // Verificar se o status code da resposta é 403
    expect(response.statusCode).toBe(403)
    console.log(response.body)
    expect(response.body).toEqual(
      expect.objectContaining({
        message: 'Not allowed.',
        error: 'Forbidden',
        statusCode: 403,
      }),
    )
  })

  test('[DELETE] /questions/:id - should not delete question if question does not exist', async () => {})

  test('[DELETE] /questions/:id - should not delete question if user is not authenticated', async () => {})

  // afterEach(async () => {
  //   await prisma.$executeRaw('DELETE FROM "QuestionAttachments";')
  //   await prisma.$executeRaw('DELETE FROM "Questions";')
  //   await prisma.$executeRaw('DELETE FROM "Students";')
  //   await prisma.$disconnect()
  //   await app.close()
  // })
})
