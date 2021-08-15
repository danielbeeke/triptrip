import { Media } from '../indexation/Media'

import titleParts from '../indexation/titleParts/all'
import blockTypes from '../blocks/all'
import fileTypes from '../indexation/fileTypes/all'

export class JournalPage {
  
  public items: Array<Media> = []

  public blocks = []
  
  constructor (items: Array<Media>) {
    this.items = items
    
    let previousType = ''
    let blockItems = []
    for (const item of this.items) {
      if (previousType !== item.type) {
        if (blockItems.length) {
          const fileType = fileTypes[ blockItems[0].type]
          this.blocks.push({
            block: fileType.defaultBlock,
            type: blockItems[0].type,
            items: blockItems
          })
        }
        blockItems = [item]
      }
      else {
        blockItems.push(item)
      }

      previousType = item.type
    }
  }

  get title () {
    return Object.values(titleParts)
    .map(titlePart => titlePart.title(this.items))
    .filter(part => part)
    .join(', ')
  }
}