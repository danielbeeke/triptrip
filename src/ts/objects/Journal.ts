import { FilesystemReference, FilesystemReferenceOptions } from '../vendor/FilesystemReference'
import { Serializable } from '../types'
import { Indexer } from '../core/Indexer'
import { JournalPage } from './JournalPage'

export class Journal implements Serializable {

  public id: string
  public title: string = ''
  public folder: FilesystemReference
  public indexer

  constructor (journalData = null) {
    Object.assign(this, journalData)

    this.folder = new FilesystemReference({
      type: 'folder',
      mode: 'readwrite'
    }, journalData?.folder)
  }

  async chooseFolder () {
    await this.folder.choose()
    const handle = await this.folder.folder()
    this.id = handle.name.replaceAll(/ /g, '-')
    this.title = handle.name
  }

  async index () {
    const rootHandle = await this.folder.folder()
    this.indexer = new Indexer(rootHandle)
    await this.indexer.execute()
  }

  get pages () {
    return this.indexer.chunks.map(chunk => new JournalPage(chunk, this))
  }

}