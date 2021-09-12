import { PluginBase } from '../core/PluginBase'
import { Chunker, Slicer, FileIndexer, Titler } from '../types'
import { Media } from '../objects/Media'
import { gpxToGeoJSON } from '../helpers/gpxToGeoJSON'
import { html } from 'uhtml/async'

export class Gpx extends PluginBase implements Chunker, FileIndexer, Titler {

  /**
   * Creates chunks of data by reading GPX tracks and marking the start and end times.
   */
  chunk (data: Array<Media | Slicer>) {
    const gpxItems = data.filter(media => media instanceof Media && media.type === 'gpx') as Array<Media>

    for (const gpxItem of gpxItems) {
      const start = new Date(gpxItem.startTime.getTime())
      start.setHours(start.getHours() - 1)
      const end = new Date(gpxItem.endTime.getTime())
      end.setHours(end.getHours() + 1)
  
      data.push({
        startTime: start,
        endTime: start,
        type: 'gpx',
        gpx: gpxItem
      })

      data.push({
        startTime: end,
        endTime: end,
        type: 'gpx',
        gpx: gpxItem
      })
    }
  }

  /**
   * Given a fileHandle with a GPX file returns a Media object.
   */
  public extensions = ['gpx']
  public defaultBlock = 'GpxTrack'
  public outputType = 'gpx'
  public async indexFile (handle: FileSystemFileHandle, rootHandle: FileSystemDirectoryHandle): Promise<Media> {
    const file = await handle.getFile()
    const blobUrl = URL.createObjectURL(file)
    const geoJSON = await gpxToGeoJSON(blobUrl)

    return new Media({
      type: this.outputType,
      file: file,
      name: file.name,
      filesize: file.size,
      handle: handle,
      geoJSON: geoJSON,
      startTime: geoJSON.properties.startTime,
      endTime: geoJSON.properties.endTime,
      duration: geoJSON.properties.duration,
      rootHandle: rootHandle
    })
  }

  /**
   * If it finds a GPX track with a title, returns it.
   */
   public titlePart (data: Array<Media>): string {
    const gpx = data.find(item => item.type === 'gpx')
    if (gpx?.geoJSON?.properties?.name) {
      return gpx.geoJSON.properties.name
    }
  }

  public blockTypes = ['gpx']
  async block (items: Array<Media>) {
    return html`gpx`
  }
}