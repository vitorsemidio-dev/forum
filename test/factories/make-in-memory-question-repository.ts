import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'

export function makeInMemoryQuestionRepository() {
  const { inMemoryQuestionsRepository } =
    makeInMemoryQuestionRepositoryWithDependencies()
  return inMemoryQuestionsRepository
}

export function makeInMemoryQuestionRepositoryWithDependencies() {
  const inMemoryQuestionAttachmentsRepository =
    new InMemoryQuestionAttachmentsRepository()
  const inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
    inMemoryQuestionAttachmentsRepository,
  )
  return {
    inMemoryQuestionsRepository,
    inMemoryQuestionAttachmentsRepository,
  }
}
