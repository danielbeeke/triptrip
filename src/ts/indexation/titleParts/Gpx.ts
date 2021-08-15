import { TitlePartBase } from './TitlePartBase'
import { Media } from '../Media'

export class Gpx extends TitlePartBase {
  public title (data: Array<Media>): string {
    const gpx = data.find(item => item.type === 'gpx')
    if (gpx?.geoJSON?.properties?.name) {
      return gpx.geoJSON.properties.name
    }    
  }

}