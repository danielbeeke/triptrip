import { Days } from '../plugins/Days'
import { Gpx } from '../plugins/Gpx'
import { Image } from '../plugins/Image'
import { Video } from '../plugins/Video'
import { Chunker, FileIndexer, Titler, Block } from '../types'

class PluginManagerClass {

  private plugins: Array<FileIndexer | Chunker | Titler | Block>

  constructor () {
    this.plugins = [
      new Days(),
      new Gpx(),
      new Image(),
      new Video()
    ]
  }

  get fileIndexers (): Array<FileIndexer> {
    return this.plugins.filter(plugin => 'indexFile' in plugin) as Array<FileIndexer>
  }

  get titlers (): Array<Titler> {
    return this.plugins.filter(plugin => 'titlePart' in plugin) as Array<Titler>
  }

  get chunkers (): Array<Chunker> {
    return this.plugins.filter(plugin => 'chunk' in plugin) as Array<Chunker>
  }

  get blocks (): Array<Block> {
    return this.plugins.filter(plugin => 'block' in plugin) as Array<Block>
  }

  get (type: 'titler' | 'fileIndexer' | 'chunker' | 'block', name: string) {
    const item = this[type + 's'].find(item => item.constructor.name === name)
    if (!item) throw new Error(`Could not find ${type} ${name}`)
    return item
  }

  getDefaultBlockByType () {
    return 'Image'
  }
}

export const PluginManager = new PluginManagerClass()