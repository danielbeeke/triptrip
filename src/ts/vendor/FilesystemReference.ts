const database: IDBDatabase = await new Promise((resolve, reject) => {
  const DBOpenRequest = indexedDB.open('FilesystemReference', 1)

  DBOpenRequest.onupgradeneeded = (event) => {
    if (event.oldVersion === 0) DBOpenRequest.result.createObjectStore('FilesystemReference', {})
  }

  DBOpenRequest.onerror = () => reject(DBOpenRequest.error)
  DBOpenRequest.onblocked = () => console.log('IndexedDB open database request was blocked')
  DBOpenRequest.onsuccess = () => resolve(DBOpenRequest.result)
})

export type FilesystemReferenceOptions = {
  type: 'folder' | 'file',
  multiple?: boolean,
  mode?: 'read' | 'readwrite'
}

export class FilesystemReference {
  private options: FilesystemReferenceOptions
  public id: number | string
  private handleData: FileSystemDirectoryHandle  | [FileSystemFileHandle]

  constructor (options: FilesystemReferenceOptions = { type:'folder' }, identifier: number | string = null) {
    this.options = options
    if (!this.options.mode) this.options.mode = 'read' 
    this.id = identifier
  }

  public async verify (): Promise<boolean> {
    const opts = { mode: this.options.mode }
  
    let handleData = await this.fetchHandleData()
    if (!handleData) throw new Error('No handle data')
    
    const handles = Array.isArray(handleData) ? handleData : [handleData]

    for (const handle of handles) {
      let permission = false
      if (await handle.queryPermission(opts) === 'granted') permission = true
      if (await handle.requestPermission(opts) === 'granted') permission = true
      if (!permission) return false
    }

    return true
  }

  public async choose () {
    let handleData
    if (this.options.type === 'folder') {
      handleData = await window.showDirectoryPicker()
    }
    else if (this.options.type === 'file') {
      handleData = await window.showOpenFilePicker({
        multiple: this.options.multiple
      })
    }
    
    this.id = await this.storeHandleData(handleData)
  }

  public async files () {
    if (this.options.type !== 'file') throw new Error('Type is folder')
    if (!this.options.multiple) throw new Error('Multiple is not set')
    await this.verify()
    const handles = await this.fetchHandleData() as [FileSystemFileHandle]
    return Promise.all(handles.map(handle => handle.getFile()))
  }

  public async file () {
    if (this.options.type !== 'file') throw new Error('Type is folder')
    if (this.options.multiple) throw new Error('Multiple is set')
    await this.verify()
    const [handle] = await this.fetchHandleData() as [FileSystemFileHandle]
    return handle.getFile()
  }

  public async folder () {
    if (this.options.type !== 'folder') throw new Error('Type is file')
    await this.verify()
    return await this.fetchHandleData() as FileSystemDirectoryHandle
  }

  public toJSON () {
    return this.id
  }

  private async fetchHandleData (): Promise<FileSystemDirectoryHandle  | [FileSystemFileHandle]> {
    if (!this.id) throw new Error('No identifier is set')
    
    if (!this.handleData) {
      return new Promise((resolve, reject) => {
        const transaction = database.transaction(['FilesystemReference'], 'readwrite');
        const objectStore = transaction.objectStore('FilesystemReference');
        const objectStoreRequest = objectStore.get(this.id)
  
        objectStoreRequest.onerror = () => reject(objectStoreRequest.error);
        objectStoreRequest.onsuccess = async () => {
          this.handleData = objectStoreRequest.result
          resolve(objectStoreRequest.result)
        }
      })  
    }
    else {
      return this.handleData
    }
  }

  private async storeHandleData (handleData: FileSystemDirectoryHandle  | [FileSystemFileHandle]): Promise<number> {
    this.handleData = handleData

    return new Promise((resolve, reject) => {
      const transaction = database.transaction(['FilesystemReference'], 'readwrite')
      const objectStore = transaction.objectStore('FilesystemReference')
      const id = Date.now()
      const objectStoreRequest = objectStore.add(handleData, id)
      objectStoreRequest.onsuccess = () => resolve(id)
      objectStoreRequest.onerror = () => reject(objectStoreRequest.error)
    })
  }

}


