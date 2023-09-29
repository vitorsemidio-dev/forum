import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed.error'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { makeQuestion } from 'test/factories/make-question'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

const makeSut = () => {
  const inMemoryQuestionAttachmentsRepository =
    new InMemoryQuestionAttachmentsRepository()
  const inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
    inMemoryQuestionAttachmentsRepository,
  )
  const sut = new EditQuestionUseCase(
    inMemoryQuestionsRepository,
    inMemoryQuestionAttachmentsRepository,
  )
  return {
    sut,
    inMemoryQuestionAttachmentsRepository,
    inMemoryQuestionsRepository,
  }
}

describe('EditQuestionUseCase', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let sut: EditQuestionUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryQuestionsRepository = dependencies.inMemoryQuestionsRepository
    inMemoryQuestionAttachmentsRepository =
      dependencies.inMemoryQuestionAttachmentsRepository
    sut = dependencies.sut
  })

  it('should edit a question', async () => {
    const newQuestion1 = makeQuestion(
      {
        authorId: new UniqueEntityId('author-id-1'),
      },
      new UniqueEntityId('question-id-1'),
    )
    const newQuestion2 = makeQuestion({}, new UniqueEntityId('question-id-2'))
    await inMemoryQuestionsRepository.create(newQuestion1)
    await inMemoryQuestionsRepository.create(newQuestion2)

    const result = await sut.execute({
      questionId: 'question-id-1',
      authorId: 'author-id-1',
      title: 'new title updated',
      content: 'new content updated',
      attachmentIds: [],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      title: 'new title updated',
      content: 'new content updated',
    })
  })

  it('should edit a question with new attachments', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-id-1'),
      },
      new UniqueEntityId('question-id-1'),
    )
    await inMemoryQuestionsRepository.create(newQuestion)
    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('attachment-id-1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('attachment-id-2'),
      }),
    )

    const result = await sut.execute({
      questionId: newQuestion.id.toString(),
      authorId: newQuestion.authorId.toString(),
      title: newQuestion.title,
      content: newQuestion.content,
      attachmentIds: ['attachment-id-1', 'attachment-id-3'],
    })
    const question = inMemoryQuestionsRepository.items[0]
    const questionAttachments = question.attachments.getItems()

    expect(result.isRight()).toBe(true)
    if (result.isLeft()) throw new Error('should not be left')
    expect(question).toBe(result.value.question)
    expect(questionAttachments.length).toBe(2)
    expect(questionAttachments[0].attachmentId.toString()).toBe(
      'attachment-id-1',
    )
    expect(questionAttachments[1].attachmentId.toString()).toBe(
      'attachment-id-3',
    )
  })

  it('should not edit a question from another user', async () => {
    const newQuestion1 = makeQuestion(
      {
        authorId: new UniqueEntityId('author-id-1'),
      },
      new UniqueEntityId('question-id-1'),
    )
    const newQuestion2 = makeQuestion({}, new UniqueEntityId('question-id-2'))
    await inMemoryQuestionsRepository.create(newQuestion1)
    await inMemoryQuestionsRepository.create(newQuestion2)

    const result = await sut.execute({
      questionId: 'question-id-1',
      authorId: 'author-id-2',
      title: 'new title updated',
      content: 'new content updated',
      attachmentIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new NotAllowedError('Not allowed.'))
  })

  it('should sync new and removed attachment when editing a question', async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityId('author-1'),
      },
      new UniqueEntityId('question-1'),
    )

    await inMemoryQuestionsRepository.create(question)

    await inMemoryQuestionAttachmentsRepository.createMany([
      QuestionAttachment.create({
        attachmentId: new UniqueEntityId('1'),
        questionId: question.id,
      }),
      QuestionAttachment.create({
        attachmentId: new UniqueEntityId('2'),
        questionId: question.id,
      }),
    ])

    const result = await sut.execute({
      questionId: question.id.toValue(),
      authorId: 'author-1',
      title: 'Pergunta teste',
      content: 'Conteúdo teste',
      attachmentIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('3'),
        }),
      ]),
    )
  })
})
