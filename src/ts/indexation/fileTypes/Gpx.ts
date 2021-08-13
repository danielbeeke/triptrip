import { FileTypeBase } from './FileTypeBase'
import { Media } from '../Media'
import { gpxToGeoJSON } from '../../helpers/gpxToGeoJSON'

export class Gpx extends FileTypeBase {
    
  public extensions = ['gpx']

  public async normalize (handle: FileSystemFileHandle): Promise<Media> {
    const file = await handle.getFile()
    const blobUrl = URL.createObjectURL(file)
    const geoJSON = await gpxToGeoJSON(blobUrl)

    return new Media({
      type: 'gpx',
      file: file,
      handle: handle,
      geoJSON: geoJSON,
      startTime: geoJSON.properties.startTime,
      endTime: geoJSON.properties.endTime,
      duration: geoJSON.properties.duration,
    })
  }

}