import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed.error'
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
  const sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
  return {
    sut,
    inMemoryQuestionAttachmentsRepository,
    inMemoryQuestionsRepository,
  }
}

describe('DeleteQuestionUseCase', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
  let sut: DeleteQuestionUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryQuestionsRepository = dependencies.inMemoryQuestionsRepository
    inMemoryQuestionAttachmentsRepository =
      dependencies.inMemoryQuestionAttachmentsRepository
    sut = dependencies.sut
  })

  it('should delete a question', async () => {
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
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepository.items.length).toBe(1)
  })

  it('should delete a question with attachments', async () => {
    const newQuestion = makeQuestion(
      {
        authorId: new UniqueEntityId('author-id-1'),
      },
      new UniqueEntityId('question-id-1'),
    )
    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: new UniqueEntityId('attachment-id-1'),
        questionId: newQuestion.id,
      }),
      makeQuestionAttachment({
        attachmentId: new UniqueEntityId('attachment-id-2'),
        questionId: newQuestion.id,
      }),
    )

    const result = await sut.execute({
      questionId: 'question-id-1',
      authorId: 'author-id-1',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionsRepository.items.length).toBe(0)
    expect(inMemoryQuestionAttachmentsRepository.items.length).toBe(0)
  })

  it('should not delete a question from another user', async () => {
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
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toEqual(new NotAllowedError('Not allowed.'))
    expect(inMemoryQuestionsRepository.items.length).toBe(2)
  })
})
