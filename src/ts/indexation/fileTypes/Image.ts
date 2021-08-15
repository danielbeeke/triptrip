import { FileTypeBase } from './FileTypeBase'
import { Media } from '../Media'
import { parse } from 'exifr'

export class Image extends FileTypeBase {
  
  public extensions = ['png', 'jpg']

  public defaultBlock = 'ImageThumbs'

  public async normalize (handle: FileSystemFileHandle): Promise<Media> {
    const file = await handle.getFile()
    const exif = await parse(file)

    return new Media({
      type: 'image',
      file: file,
      handle: handle,
      exif: exif,
      startTime: new Date(file.lastModified),
      endTime: new Date(file.lastModified),
      latitude: exif.latitude,
      longitude: exif.longitude,    
    })
  }

}