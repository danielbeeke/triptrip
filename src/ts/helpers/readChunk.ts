export const readChunk = (file) => (chunkSize: number, offset: number): Promise<Uint8Array> | Uint8Array => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = (event) => {
    if (event.target.error) reject(event.target.error)
    resolve(new Uint8Array(event.target.result as ArrayBufferLike))
  }
  reader.readAsArrayBuffer(file.slice(offset, offset + chunkSize))
})
