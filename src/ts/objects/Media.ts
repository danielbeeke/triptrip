import { MediaOptions } from '../types'

export class Media {
  
  public handle: FileSystemFileHandle  
  public file: File
  public hash: string
  public path: string
  public name: string
  public startTime: Date
  public endTime: Date
  public type: string
  public filesize: number
  public latitude: number
  public longitude: number
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

  serialize () {
    return {
      name: this.name,
      type: this.type,
      filesize: this.filesize,
      path: this.path,
      hash: this.hash,
      startTime: this.startTime.getTime(),
      endTime: this.endTime.getTime(),
      latitude: this.latitude,
      longitude: this.longitude,
    }
  }
}