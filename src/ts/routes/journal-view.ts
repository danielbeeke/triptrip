import { html, render, define } from 'uce'
import { t } from '../core/translation'
import { journalRepository as repo } from '../repository/journalRepository'
import { RouterPage } from '../types'
import { ErrorNotFound } from '../core/errors'
import { Router } from '@vaadin/router'

const journalView: RouterPage = {
  async render() {
    try {
      const journal = repo.get(this.location.params.name)
      await journal.index()

      this.html`
        <h1>${journal.title}</h1>

        <ul>
        ${[...journal.chunks.entries()].map(([index, chunk]) => html`
          <li>
            <a href=${`/journal/${this.location.params.name}/${index}`}>${chunk.title}</a>
          </li>
        `)}
        </ul>
      `
    }
    catch (exception) {
      if (exception instanceof ErrorNotFound) {
        Router.go('/not-found')
      }

      if (exception instanceof DOMException && exception.message.includes('permissions')) {
        Router.go('/journal')
      }

      console.log(exception)
    }
  },
}

define('journal-view', journalView)