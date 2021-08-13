import { MediaOptions } from '../types'

export class Media {
  
  private handle: FileSystemFileHandle  
  private file: File
  public startTime: Date
  public endTime: Date
  public type: string
  public geoJSON: {
    properties: {
      name: string
    }
  }

  constructor (options: MediaOptions) {
    Object.assign(this, options)
  }

}