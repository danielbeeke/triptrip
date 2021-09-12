import { FilesystemReference } from '../vendor/FilesystemReference'
import { Serializable } from '../types'
import { Indexer } from '../core/Indexer'
import { JournalPage } from './JournalPage'
import { EasyDatabase } from '../core/Database'

export class Journal implements Serializable {

  public id: string
  public title: string = ''
  public folder: FilesystemReference
  public indexer: Indexer
  private database: EasyDatabase

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
    await this.open()

    const knownMedia = this.database.query(`SELECT * FROM media`)

    console.log(knownMedia)
    const rootHandle = await this.folder.folder()
    this.indexer = new Indexer(rootHandle, this.database)
    return this.indexer[Symbol.asyncIterator]()
  }

  get pages () {
    return this.indexer?.chunks?.map(chunk => new JournalPage(chunk.items, this)) ?? []
  }

  async open () {
    const rootHandle = await this.folder.folder()
    const triptripDirectory = await rootHandle.getDirectoryHandle('.triptrip', { create: true })
    const databaseFileHandle = await triptripDirectory.getFileHandle('database.sqlite', { create: true })
    this.database = new EasyDatabase(databaseFileHandle)
    await this.database.init()
  }

  async save () {
    return this.database.save()
  }
}