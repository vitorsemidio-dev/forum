import { InvalidAttachmentTypeError } from '@/domain/forum/application/use-cases/errors/invalid-attachment-type.error'
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { FakeUploader } from 'test/storage/fake-uploader'

const makeSut = () => {
  const inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()
  const fakeUploader = new FakeUploader()
  const sut = new UploadAndCreateAttachmentUseCase(
    inMemoryAttachmentsRepository,
    fakeUploader,
  )

  return {
    sut,
    inMemoryAttachmentsRepository,
    fakeUploader,
  }
}

describe('Upload and create attachment', () => {
  let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
  let fakeUploader: FakeUploader
  let sut: UploadAndCreateAttachmentUseCase

  beforeEach(() => {
    const dependencies = makeSut()
    inMemoryAttachmentsRepository = dependencies.inMemoryAttachmentsRepository
    fakeUploader = dependencies.fakeUploader
    sut = dependencies.sut
  })

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      attachment: inMemoryAttachmentsRepository.items[0],
    })
    expect(fakeUploader.uploads).toHaveLength(1)
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    )
  })

  it('should not be able to upload an attachment with invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'profile.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError)
  })
})
