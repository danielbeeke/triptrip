import { Media } from '../Media'

export abstract class TitlePartBase {

  public abstract title (data: Array<Media>): string

}