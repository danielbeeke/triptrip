import { Media } from '../indexation/Media'
import { html, render, define } from 'uce'

export class BlockBase {
  public applicableFileTypes = []

  render (items: Array<Media>) {
    return html`<span>${items.length}</span>`
  }
}