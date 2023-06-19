import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { makeInMemoryAnswerRepository } from 'test/factories/make-in-memory-answer-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

const makeSut = () => {
  const inMemoryAnswersRepository = makeInMemoryAnswerRepository()
  const sut = new AnswerQuestionUseCase(inMemoryAnswersRepository)
  return { sut, inMemoryAnswersRepository }
}

describe('AnswerQuestionUseCase', () => {
  let inMemoryAnswersRepository: InMemoryAnswersRepository
  let sut: AnswerQuestionUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryAnswersRepository = dependencies.inMemoryAnswersRepository
    sut = dependencies.sut
  })

  it('create an answer without attachments', async () => {
    const result = await sut.execute({
      attachmentIds: [],
      instructorId: 'any_instructor_id',
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
      instructorId: 'any_instructor_id',
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
})
