import { ErrorNotFound } from '../core/errors'

export class LocalStorageRepository<T> extends EventTarget {

  public type: string = ''
  public classReference

  constructor () {
    super()
  }

  getAll (): Array<T> {
    return Object.entries(localStorage)
    .filter(([key]) => key.startsWith(this.type + '-'))
    .map(([key, item]) => {
      return new this.classReference(JSON.parse(item))
    })
  }

  get (id: string) {
    const item = localStorage.getItem(this.type + '-' + id)
    if (!item) throw new ErrorNotFound('Unknown object')
    return new this.classReference(JSON.parse(item))
  }

  save (object) {
    if (!(object instanceof this.classReference)) throw new Error('Incorrect object')
    if (!object.id) throw new Error('Object has no ID')
    localStorage.setItem(this.type + '-' + object.id, JSON.stringify(object))
  }

  create (...args): T {
    return new this.classReference(...args)
  }
}