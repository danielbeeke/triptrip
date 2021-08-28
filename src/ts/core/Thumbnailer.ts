import { Media } from '../objects/Media'
import Pica from 'pica'
const pica = Pica()

class ThumbnailerClass {

  async get (media: Media, width: number | undefined, height: number | undefined) {
    try {
      const cacheFolder = await media.rootHandle.getDirectoryHandle('.thumbs', { create: true })
      let existingFile = null
      try {
        existingFile = await cacheFolder.getFileHandle(media.file.name)
        if (existingFile) return URL.createObjectURL(await existingFile.getFile())  
      }
      catch(exception) {}
  
      const image = new Image()
      const canvas = document.createElement('canvas')
  
      return new Promise((resolve, reject) => {
        image.onload = async () => {
          if (!height) height = image.height * 1 / image.width * width
          if (!width) width = image.width * 1 / image.height * height
    
          canvas.width = width
          canvas.height = height
          
          const result = await pica.resize(image, canvas)
          const blob = await pica.toBlob(result, 'image/jpeg', 0.70)
          const thumbnail = await cacheFolder.getFileHandle(media.handle.name, { create: true })
          const writableStream = await thumbnail.createWritable()

          await writableStream.write(blob)
          await writableStream.close()
          const objectURL = URL.createObjectURL(blob)
          resolve(objectURL)
        }
    
        image.src = URL.createObjectURL(media.file)
      })
    }
    catch (exception) {
      console.log(exception)
    }
  }
}

export const Thumbnailer = new ThumbnailerClass()