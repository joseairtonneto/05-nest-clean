import { Attachment } from '../../enterprise/entities/attachment'

export abstract class AttachmentsRepository {
  abstract findById(id: string): Promise<Attachment | null>
  abstract create(attachment: Attachment): Promise<void>
  abstract save(attachment: Attachment): Promise<void>
  abstract delete(attachment: Attachment): Promise<void>
}
