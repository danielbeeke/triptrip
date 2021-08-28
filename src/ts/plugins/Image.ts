import { PluginBase } from '../core/PluginBase'
import { FileIndexer, Block } from '../types'
import { Media } from '../objects/Media'
import { parse } from 'exifr'
import { html } from 'uhtml/async'
import { Thumbnailer } from '../core/Thumbnailer'
import PhotoSwipeLightbox from 'photoswipe/dist/photoswipe-lightbox.esm.js';
import PhotoSwipe from 'photoswipe/dist/photoswipe.esm.js';
import 'photoswipe/dist/photoswipe.css';
import blockhash from "blockhash-core"
import { getImageData } from "@canvas/image"

export class Image extends PluginBase implements FileIndexer, Block {

  /**
   * Given a fileHandle with an image file returns a Media object.
   */
  public defaultBlock = 'Image'
  public extensions = ['png', 'jpg']
  public outputType = 'image'
  public async indexFile (handle: FileSystemFileHandle, rootHandle: FileSystemDirectoryHandle): Promise<Media> {
    const file = await handle.getFile()
    const exif = await parse(file)

    return new Media({
      type: this.outputType,
      file: file,
      imageHash: async () => {
        const image = new globalThis.Image()
        image.src = URL.createObjectURL(file)
        await image.decode()
          /** @ts-ignore */
        const imageData = await getImageData(image)
        return await blockhash.bmvbhash(imageData, 8)
      },
      handle: handle,
      exif: exif,
      startTime: new Date(file.lastModified),
      endTime: new Date(file.lastModified),
      latitude: exif.latitude,
      longitude: exif.longitude,
      rootHandle: rootHandle
    })
  }

  public blockTypes = ['image']
  async block (items: Array<Media>) {
    if (items[0].type === 'video') return html`Video`

    const photoswipe = (element) => {
      const lightbox = new PhotoSwipeLightbox({
        gallerySelector: 'body',
        childSelector: 'a.pswp-item',
        pswpModule: PhotoSwipe
      })
      lightbox.init()
    }

    return html`<div ref=${photoswipe} class="pswp-gallery">
      ${items.map(item => html`

      <a href=${URL.createObjectURL(item.file)} 
        data-pswp-width=${item.exif.ImageWidth}
        data-pswp-height=${item.exif.ImageHeight}
        data-cropped="true" 
        class="pswp-item"
        target="_blank">
        <img src=${Thumbnailer.get(item, 200, undefined)}>
      </a>

      `)}
    </div>`
  }

}