import { Image } from './fileTypes/Image'
import { Video } from './fileTypes/Video'
import { Gpx } from './fileTypes/Gpx'

import { Days } from './chunkers/Days'
import { Gpx as GpxChunker } from './chunkers/Gpx'

import { Media } from './Media'
import { Slicer } from '../types'

export class Indexer {
  private fileTypes = [ new Image(), new Video(), new Gpx() ]
  private chunkers = [ new Days(), new GpxChunker() ]
  private rootFolderHandle: FileSystemDirectoryHandle
  private data: Array<Media | Slicer> = []
  private chunks: Array<{
    title: string,
    items: Array<Media>
  }> = []

  constructor (folderHandle: FileSystemDirectoryHandle) {
    this.rootFolderHandle = folderHandle
    this.chunkers.sort((a, b) => b.weight - a.weight)
  }

  async processFolder (folderHandle: FileSystemDirectoryHandle) {
    for await (const handle of folderHandle.values()) {
      if (handle.kind === 'directory') await this.processFolder(handle)
      else if (handle.kind === 'file') await this.processFile(handle)
    }
  }

  async processFile (handle: FileSystemFileHandle) {
    const extension = handle.name.split('.').pop().toLowerCase()
    for (const fileType of this.fileTypes) {
      if (fileType.match(extension)) {
        this.data.push(await fileType.normalize(handle))
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
    for (const chunker of this.chunkers) {
      sortData()
      chunker.process(this.data)
    }
    sortData()

    console.log(this.data)

    // /**
    //  * Cut the chunks into arrays.
    //  */
    // const chunks = []
    // let currentChunk = []

    // const addChunk = (item) => {
    //   if (currentChunk.length) chunks.push({
    //     title: item.title,
    //     items: currentChunk,
    //   })
    // }

    // for (const item of this.data) {
    //   if (item instanceof Media) currentChunk.push(item)
    //   else {
    //     addChunk(item)
    //     currentChunk = []
    //   }
    // }

    // addChunk(this.data[this.data.length - 1])

    // this.chunks = chunks
  }

  toJSON () {
    return null
  }
}