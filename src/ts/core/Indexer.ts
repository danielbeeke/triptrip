import { Media } from '../objects/Media'
import { Slicer } from '../types'
import { EasyDatabase } from './Database'
import { PluginManager } from './PluginManager'

export class Indexer {
  private rootFolderHandle: FileSystemDirectoryHandle
  private data: Array<Media | Slicer> = []
  private database: EasyDatabase
  public chunks: Array<{
    title: string,
    items: Array<Media>
  }> = []

  constructor (folderHandle: FileSystemDirectoryHandle, database: EasyDatabase) {
    this.rootFolderHandle = folderHandle
    this.database = database
  }

  async* [Symbol.asyncIterator] () {
    const filePromises = []

    const processFolder = async (folderHandle: FileSystemDirectoryHandle, parents: Array<FileSystemDirectoryHandle> = []) => {
      for await (const handle of folderHandle.values()) {
        if (['.thumbs'].includes(handle.name)) continue
        if (handle.kind === 'directory') await processFolder(handle, [...parents, handle])
        else if (handle.kind === 'file') {
          const promise = processFile(handle, [...parents])
          /** @ts-ignore */
          promise.handle = handle
          filePromises.push(promise)
        }
      }
    }
  
    const processFile = async (handle: FileSystemFileHandle, parents: Array<FileSystemDirectoryHandle> = []) => {
      const extension = handle.name.split('.').pop().toLowerCase()
      for (const fileType of PluginManager.fileIndexers) {
        if (fileType.extensions.includes(extension)) {
          const mediaItem = await fileType.indexFile(handle, this.rootFolderHandle)
          mediaItem.path = parents.map(parent => parent.name).join('/') + '/' + handle.name
          this.database.upsert('media', mediaItem.serialize())
          this.data.push(mediaItem)
          return mediaItem
        }
      }
    }

    const sortData = () => this.data.sort((a: Media, b: Media) => a.startTime.getTime() - b.startTime.getTime())
    await processFolder(this.rootFolderHandle, [this.rootFolderHandle])

    for (const promise of filePromises) {
      yield promise
    }

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

    yield 'done'
  }

  toJSON () {
    return null
  }
}