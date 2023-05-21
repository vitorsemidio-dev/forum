import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

describe('Slug', () => {
  it('should create a slug from a text', () => {
    const slug = Slug.createFromText('  This is a slug  ')

    expect(slug.value).toBe('this-is-a-slug')
  })
})
