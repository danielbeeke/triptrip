import { Media } from '../Media'
import { Slicer } from '../../types'

export abstract class ChunkerBase {

  public name = 'base'

  public weight = 1000

  public abstract process (data: Array<Media | Slicer>)
}