import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { fakerPtBr } from 'test/utils/faker'

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityId,
): Question {
  const title = fakerPtBr.lorem.sentence()
  const slug = Slug.createFromText(title)
  const question = Question.create(
    {
      title,
      slug,
      authorId: new UniqueEntityId(),
      content: fakerPtBr.lorem.text(),
      ...override,
    },
    id,
  )

  return question
}
