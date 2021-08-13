import { FilesystemReference, FilesystemReferenceOptions } from '../vendor/FilesystemReference'
import { Serializable } from '../types'
import { Indexer } from '../indexation/Indexer'
import { JournalPage } from './JournalPage'

export class Journal implements Serializable {

  public id: string
  public title: string = ''
  private folder: FilesystemReference
  public indexer

  constructor (journalData = null) {
    const filesystemReferenceOptions: FilesystemReferenceOptions = {
      type: 'folder',
      mode: 'readwrite'
    }

    Object.assign(this, journalData)

    this.folder = new FilesystemReference(filesystemReferenceOptions, journalData?.folder)
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

  get chunks () {
    return this.indexer.chunks.map(chunk => new JournalPage(chunk))
  }

}