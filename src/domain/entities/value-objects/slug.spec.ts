import { Slug } from '@/domain/entities/value-objects/slug'

test('it should create a slug from a text', () => {
  const slug = Slug.createFromText('  This is a slug  ')

  expect(slug.value).toBe('this-is-a-slug')
})
