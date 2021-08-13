import { Media } from '../indexation/Media'

export class JournalPage {
  
  public title: string
  public items: Array<Media> = []

  public blocks = []
  
  constructor (options: { items: Array<Media>, title: string }) {
    Object.assign(this, options)
  }

  // get title () {
  //   console.log(this.items)

  //   const gpx = this.items.find(item => item.type === 'gpx')
  //   if (gpx?.geoJSON?.properties?.name) {
  //     return gpx.geoJSON.properties.name
  //   }

  //   const formatter = new Intl.DateTimeFormat('en')
  //   return formatter.format(this.items[0].startTime)
  // }
}