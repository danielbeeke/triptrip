import { TitlePartBase } from './TitlePartBase'
import { Media } from '../Media'

export class Days extends TitlePartBase {
  public title (data: Array<Media>): string {
    const formatter = new Intl.DateTimeFormat('en')
    return formatter.format(data[0].startTime)    
  }

}