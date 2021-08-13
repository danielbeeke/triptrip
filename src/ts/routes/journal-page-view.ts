import { html, render, define } from 'uce'
import { t } from '../core/translation'
import { journalRepository as repo } from '../repository/journalRepository'
import { RouterPage } from '../types'
import { ErrorNotFound } from '../core/errors'
import { Router } from '@vaadin/router'

const journalPageView: RouterPage = {
  async render() {
    try {
      const journal = repo.get(this.location.params.name)
      await journal.index()
      const currentChunk = journal.chunks[parseInt(this.location.params.index)]

      console.log(currentChunk)

      this.html`
        <h1>${currentChunk.title}, ${journal.title}</h1>
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

define('journal-page-view', journalPageView)