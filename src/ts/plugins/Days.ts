import { PluginBase } from '../core/PluginBase'
import { Chunker, Slicer, Titler } from '../types'
import { Media } from '../objects/Media'

export class Days extends PluginBase implements Chunker, Titler {

  /**
   * Creates chunks of data by applying the start times of days.
   */
  chunk (data: Array<Media | Slicer>) {
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

  /**
   * Given all the Media objects, returns a day title part.
   */
  public titlePart (data: Array<Media>): string {
    const formatter = new Intl.DateTimeFormat('en')
    return formatter.format(data[0].startTime)    
  }

}