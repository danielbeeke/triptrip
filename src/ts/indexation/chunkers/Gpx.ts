import { ChunkerBase } from './ChunkerBase'
import { Media } from '../Media'
import { Slicer } from '../../types'

export class Gpx extends ChunkerBase {

  public name = 'gpx'

  public weight = 50

  public process (data: Array<Media | Slicer>) {
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


}
