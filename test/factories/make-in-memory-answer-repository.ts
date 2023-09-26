import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'

export function makeInMemoryAnswerRepository() {
  const { inMemoryAnswersRepository } =
    makeInMemoryAnswerRepositoryWithDependencies()
  return inMemoryAnswersRepository
}

export function makeInMemoryAnswerRepositoryWithDependencies() {
  const inMemoryAnswerAttachmentsRepository =
    new InMemoryAnswerAttachmentsRepository()
  const inMemoryAnswersRepository = new InMemoryAnswersRepository(
    inMemoryAnswerAttachmentsRepository,
  )
  return {
    inMemoryAnswerAttachmentsRepository,
    inMemoryAnswersRepository,
  }
}
