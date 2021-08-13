import { ChunkerBase } from './ChunkerBase'
import { Media } from '../Media'
import { Slicer } from '../../types'

export class Days extends ChunkerBase {

  public name = 'days'

  public weight = 100

  public process (data: Array<Media | Slicer>) {
    const start = new Date(data[0].startTime.getTime())
    start.setHours(0, 0, 0)
    const end = new Date(data[data.length - 1].endTime.getTime())
    end.setDate(end.getDate() + 1)
    end.setHours(0, 0, 0)

    for (let day = new Date(start.getTime()); day <= end; day.setDate(day.getDate() + 1)) {
      data.push({
        startTime: new Date(day.getTime()),
        endTime: new Date(day.getTime()),
        type: 'days'
      })
    }
  }

}
