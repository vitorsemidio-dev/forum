import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachments-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-student.repository'

export function makeInMemoryQuestionRepository() {
  const { inMemoryQuestionsRepository } =
    makeInMemoryQuestionRepositoryWithDependencies()
  return inMemoryQuestionsRepository
}

export function makeInMemoryQuestionRepositoryWithDependencies() {
  const inMemoryQuestionAttachmentsRepository =
    new InMemoryQuestionAttachmentsRepository()
  const inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
  const inMemoryStudentsRepository = new InMemoryStudentsRepository()
  const inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
    inMemoryQuestionAttachmentsRepository,
    inMemoryAttachmentsRepository,
    inMemoryStudentsRepository,
  )
  return {
    inMemoryQuestionsRepository,
    inMemoryQuestionAttachmentsRepository,
    inMemoryAttachmentsRepository,
    inMemoryStudentsRepository,
  }
}
