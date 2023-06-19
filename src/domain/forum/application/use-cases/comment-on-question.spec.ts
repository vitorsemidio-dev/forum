import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { makeInMemoryQuestionRepository } from 'test/factories/make-in-memory-question-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionCommentsRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

const makeSut = () => {
  const inMemoryQuestionsRepository = makeInMemoryQuestionRepository()
  const inMemoryQuestionCommentsRepository =
    new InMemoryQuestionCommentsRepository()
  const sut = new CommentOnQuestionUseCase(
    inMemoryQuestionsRepository,
    inMemoryQuestionCommentsRepository,
  )
  return {
    sut,
    inMemoryQuestionsRepository,
    inMemoryQuestionCommentsRepository,
  }
}

describe('Comment on Question', () => {
  let inMemoryQuestionsRepository: InMemoryQuestionsRepository
  let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
  let sut: CommentOnQuestionUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryQuestionsRepository = dependencies.inMemoryQuestionsRepository
    inMemoryQuestionCommentsRepository =
      dependencies.inMemoryQuestionCommentsRepository
    sut = dependencies.sut
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionsRepository.create(question)

    const result = await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'Comentário teste',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      'Comentário teste',
    )
  })
})
