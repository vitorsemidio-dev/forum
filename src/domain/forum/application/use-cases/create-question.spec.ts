import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { makeInMemoryQuestionRepositoryWithDependencies } from 'test/factories/make-in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

const makeSut = () => {
  const { inMemoryQuestionsRepository, inMemoryQuestionAttachmentsRepository } =
    makeInMemoryQuestionRepositoryWithDependencies()
  const sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
  return {
    sut,
    inMemoryQuestionsRepository,
    inMemoryQuestionAttachmentsRepository,
  }
}

describe('CreateQuestionUseCase', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository

  let sut: CreateQuestionUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryQuestionsRepository = dependencies.inMemoryQuestionsRepository
    inMemoryQuestionAttachmentsRepository =
      dependencies.inMemoryQuestionAttachmentsRepository
    sut = dependencies.sut
  })

  it('create a question', async () => {
    const result = await sut.execute({
      authorId: 'any_author_id',
      content: 'any_content',
      title: 'any_title',
      attachmentIds: ['any_attachment_id'],
    })

    const question = inMemoryQuestionsRepository.items[0]
    const questionAttachments = question.attachments.getItems()

    expect(result.isRight()).toBe(true)
    expect(question).toBe(result.value?.question)
    expect(questionAttachments.length).toBe(1)
    expect(questionAttachments[0].attachmentId.toString()).toBe(
      'any_attachment_id',
    )
  })

  it('should persist attachments when creating a new question', async () => {
    const question = makeQuestion()
    const result = await sut.execute({
      authorId: question.authorId.toString(),
      title: question.title,
      content: question.content,
      attachmentIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityId('1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityId('2'),
        }),
      ]),
    )
  })
})
