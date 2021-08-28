import { Media } from './Media'
import { PluginManager } from '../core/PluginManager'
import { Journal } from './Journal'
import { v4 } from 'uuid'


export class JournalPage {
  
  public items: Array<Media> = []
  private journal: Journal

  public blocks = []
  
  constructor (items: Array<Media>, journal: Journal) {
    this.journal = journal
    this.items = items

    let previousType = ''
    let blockItems = []
    for (const item of this.items) {
      if (previousType !== item.type) {
        if (blockItems.length) {
          const defaultBlock = PluginManager.getDefaultBlockByType()

          this.blocks.push({
            id: v4(),
            block: defaultBlock,
            type: blockItems[0].type,
            data: {
              items: blockItems,
            }
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
    return PluginManager.titlers
    .map(titlePart => titlePart.titlePart(this.items))
    .filter(part => part)
    .join(', ')
  }

  get handle () {
    return this.journal.folder.folder()
  }
}