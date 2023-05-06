export class Slug {
  public value: string;
  constructor(value: string) {
    this.value = value;
  }

  /**
   * Receives a string and normalizes it to a slug.
   * @param text The string to be normalized.
   * @returns {Slug}.
   */

  static createFromText(text: string): Slug {
    const slug = text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/_/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-')
      .replace(/-$/, '');
    return new Slug(slug);
  }
}
