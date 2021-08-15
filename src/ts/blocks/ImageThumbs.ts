import { BlockBase } from './BlockBase'
import { html } from 'uce'
import { Media } from '../indexation/Media'

export class ImageThumbs extends BlockBase {
  public applicableFileTypes = ['image']

  render (items: Array<Media>) {

    const renderThumbnail = (canvas, file: File) => {
      const url = URL.createObjectURL(file)
      const image = document.createElement('img')
      image.onload = () => {
        canvas.width = 100
        canvas.height = 100
        canvas.getContext('2d').drawImage(image, 0, 0, 100, 100);
      }
      image.src = url
    }

    return html`<div class="image-thumbs">${
      items.map(item => {
        return html`<canvas ref=${(element) => renderThumbnail(element, item.file)} />`
      })
    }</div>`
  }
}