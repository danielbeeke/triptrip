import { render, html } from 'uhtml/async'
import { Media } from '../objects/Media'

export class PluginBase {

  public data: any
  public wrapper: HTMLDivElement

  constructor(options) {
    this.data = options?.data
    this.wrapper = undefined
  }

  render () {
    if (!this.wrapper) this.wrapper = document.createElement('div')
    render(this.wrapper, this.block(this.data.items))
    return this.wrapper
  }

  block (items: Array<Media>) {
    return html``
  }
}