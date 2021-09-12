import { PluginBase } from '../core/PluginBase'
import { FileIndexer, Track } from '../types'
import { Media } from '../objects/Media'
import MediaInfo from 'mediainfo.js'
import { readChunk } from '../helpers/readChunk'
const mediainfo = await MediaInfo({ locateFile: () =>  '/wasm/MediaInfoModule.wasm'})

export class Video extends PluginBase implements FileIndexer {

  /**
   * Given a fileHandle with a GPX file returns a Media object.
   */
  public defaultBlock = 'VideoThumbs'
  public extensions = ['mp4']
  public outputType = 'video'
  public async indexFile (handle: FileSystemFileHandle, rootHandle: FileSystemDirectoryHandle): Promise<Media> {
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
      type: this.outputType,
      file: file,
      name: file.name,
      handle: handle,
      filesize: file.size,
      startTime: startTime,
      endTime: endTime,
      duration: duration,
      longitude: longitude,
      latitude: latitude,
      rootHandle: rootHandle
    })
  }

  /**
   * Given a video file returns and caches the meta data.
   */
  async parseMeta (file: File): Promise<Track> {
    let generalTrack = localStorage.getItem(file.name) ? JSON.parse(localStorage.getItem(file.name)) : null

    if (!generalTrack) {
      const { media: { track } } = await mediainfo.analyzeData(() => file.size, readChunk(file)) as { media: { track: Array<unknown>} }
      generalTrack = track[0] as Track
      localStorage.setItem(file.name, JSON.stringify(generalTrack))
    }

    return generalTrack
  }
}