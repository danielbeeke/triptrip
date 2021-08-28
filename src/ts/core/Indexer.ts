import { Media } from '../objects/Media'
import { Slicer } from '../types'
import { PluginManager } from './PluginManager'

export class Indexer {
  private rootFolderHandle: FileSystemDirectoryHandle
  private data: Array<Media | Slicer> = []
  public chunks: Array<{
    title: string,
    items: Array<Media>
  }> = []

  constructor (folderHandle: FileSystemDirectoryHandle) {
    this.rootFolderHandle = folderHandle
  }

  async processFolder (folderHandle: FileSystemDirectoryHandle) {
    for await (const handle of folderHandle.values()) {
      if (handle.name === '.thumbs') continue
      if (handle.kind === 'directory') await this.processFolder(handle)
      else if (handle.kind === 'file') await this.processFile(handle)
    }
  }

  async processFile (handle: FileSystemFileHandle) {
    const extension = handle.name.split('.').pop().toLowerCase()
    for (const fileType of PluginManager.fileIndexers) {
      if (fileType.extensions.includes(extension)) {
        this.data.push(await fileType.indexFile(handle, this.rootFolderHandle))
      }
    }
  }

  async execute () {
    const sortData = () => this.data.sort((a: Media, b: Media) => a.startTime.getTime() - b.startTime.getTime())
    await this.processFolder(this.rootFolderHandle)
 
    /**
     * Add strings that seperate the activities / days etc.
     * 
     */
    for (const chunker of PluginManager.chunkers) {
      sortData()
      chunker.chunk(this.data)
    }
    sortData()

    /**
     * Cut the chunks into arrays.
     */
    const chunks = []
    let currentChunk = []

    const addChunk = () => {
      if (currentChunk.length) chunks.push(currentChunk)
    }

    for (const item of this.data) {
      if (item instanceof Media) currentChunk.push(item)
      else {
        addChunk()
        currentChunk = []
      }
    }

    addChunk()

    this.chunks = chunks
  }

  toJSON () {
    return null
  }
}