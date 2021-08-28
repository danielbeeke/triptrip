import { MediaOptions } from '../types'

export class Media {
  
  public handle: FileSystemFileHandle  
  public file: File
  public startTime: Date
  public endTime: Date
  public type: string
  public rootHandle: FileSystemDirectoryHandle
  public geoJSON: {
    properties: {
      name: string
    }
  }
  public exif: any

  constructor (options: MediaOptions) {
    Object.assign(this, options)
  }

}