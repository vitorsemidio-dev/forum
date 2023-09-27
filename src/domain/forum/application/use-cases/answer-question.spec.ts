import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { makeInMemoryAnswerRepositoryWithDependencies } from 'test/factories/make-in-memory-answer-repository'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

const makeSut = () => {
  const { inMemoryAnswersRepository, inMemoryAnswerAttachmentsRepository } =
    makeInMemoryAnswerRepositoryWithDependencies()
  const sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  return { sut, inMemoryAnswersRepository, inMemoryAnswerAttachmentsRepository }
}

describe('AnswerQuestionUseCase', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository
  let sut: AnswerQuestionUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryAnswersRepository = dependencies.inMemoryAnswersRepository
    inMemoryAnswerAttachmentsRepository =
      dependencies.inMemoryAnswerAttachmentsRepository
    sut = dependencies.sut
  })

  it('create an answer without attachments', async () => {
    const result = await sut.execute({
      attachmentIds: [],
      authorId: 'any_instructor_id',
      questionId: 'any_question_id',
      content: 'any_content',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.answer.id.toValue()).toBeTruthy()
    expect(result.value?.answer.content).toBe('any_content')
    expect(inMemoryAnswersRepository.items[0].id.toValue()).toBe(
      result.value?.answer.id.toValue(),
    )
  })

  it('should create an answer with attachments', async () => {
    const result = await sut.execute({
      attachmentIds: ['any_attachment_id'],
      authorId: 'any_instructor_id',
      questionId: 'any_question_id',
      content: 'any_content',
    })

    const answer = inMemoryAnswersRepository.items[0]
    const answerAttachments = answer.attachments.getItems()

    expect(result.isRight()).toBe(true)
    expect(answer).toBe(result.value?.answer)
    expect(answerAttachments.length).toBe(1)
    expect(answerAttachments[0].attachmentId.toString()).toBe(
      'any_attachment_id',
    )
  })

  it('should persist attachments when creating a new answer', async () => {
    const result = await sut.execute({
      questionId: '1',
      authorId: '1',
      content: 'Conteúdo da resposta',
      attachmentIds: ['1', '2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2)
    expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
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
