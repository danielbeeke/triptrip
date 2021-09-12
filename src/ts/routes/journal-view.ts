import { html, define } from 'uce'
import { t } from '../core/translation'
import { journalRepository as repo } from '../repository/journalRepository'
import { RouterPage } from '../types'
import { useState } from '../helpers/useState'
import { useEffect } from '../helpers/useEffect'

const journalView: RouterPage = {

  async render() {
    const journal = repo.get(this.location.params.name)
    const state = useState(this, { currentName: '' })

    useEffect(async () => {
      const items = await journal.index()
      for await (const item of items) {
        state.currentName = item?.handle?.name ?? ''
        await this.render()
      }

      await journal.save()
      await this.render()
    })

    this.html`
      <h1>${journal.title}</h1>

      <h3>${journal.indexer?.chunks?.length} ${new Date().getTime()}</h3>

      <h4>${state.currentName}</h4>

      <ul>
      ${[...journal.pages.entries()].map(([index, journalPage]) => html`
        <li>
          <a href=${`/journal/${this.location.params.name}/${index}`}>${journalPage.title}</a>
        </li>
      `)}
      </ul>
    `
  },
}

define('journal-view', journalView)