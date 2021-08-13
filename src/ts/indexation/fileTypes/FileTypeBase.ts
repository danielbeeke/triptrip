import { Media } from '../Media'

export abstract class FileTypeBase {

  public extensions = []

  public match (extension: string) {
    return this.extensions.includes(extension)
  }

  public abstract normalize (handle: FileSystemFileHandle): Promise<Media>

}