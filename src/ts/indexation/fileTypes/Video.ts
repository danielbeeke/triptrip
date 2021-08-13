import { FileTypeBase } from './FileTypeBase'
import { Media } from '../Media'
import MediaInfo from 'mediainfo.js'
import { readChunk } from '../../helpers/readChunk'
import { Track } from '../../types'

const mediainfo = await MediaInfo({ locateFile: () =>  '/wasm/MediaInfoModule.wasm'})

export class Video extends FileTypeBase {
  
  public extensions = ['mp4']

  public async normalize (handle: FileSystemFileHandle): Promise<Media> {
    const file = await handle.getFile()

    const meta = await this.parseMeta(file)
    const startTime = new Date(file.lastModified)
    const duration = parseFloat(meta.Duration)
    const endTime = new Date(startTime.getTime() + duration)


    let longitude = null
    let latitude = null
    if (meta.extra?.xyz) {
      const [, lat, lon ] = meta.extra?.xyz.split(/\+|\-|\//g)
      longitude = parseFloat(lon)
      latitude = parseFloat(lat)
    }

    return new Media({
      type: 'video',
      file: file,
      handle: handle,
      startTime: startTime,
      endTime: endTime,
      duration: duration,
      longitude: longitude,
      latitude: latitude
    })
  }

  async parseMeta (file: File) {
    let generalTrack = localStorage.getItem(file.name) ? JSON.parse(localStorage.getItem(file.name)) : null

    if (!generalTrack) {
      const { media: { track } } = await mediainfo.analyzeData(() => file.size, readChunk(file)) as { media: { track: Array<unknown>} }
      generalTrack = track[0] as Track
      localStorage.setItem(file.name, JSON.stringify(generalTrack))
    }

    return generalTrack
  }
}