import { LocalStorageRepository } from './LocalStorageRepository'
import { Journal } from '../objects/Journal'

class JournalRepository extends LocalStorageRepository<Journal> {

  public type: string = 'journal'
  public classReference = Journal

  constructor () {
    super()
  }
}

export const journalRepository = new JournalRepository()