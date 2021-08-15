import { html, render, define } from 'uce'
import { t } from '../core/translation'
import { journalRepository as repo } from '../repository/journalRepository'
import { RouterPage } from '../types'
import { ErrorNotFound } from '../core/errors'
import { Router } from '@vaadin/router'
import blockTypes from '../blocks/all'

const journalPageView: RouterPage = {
  async render() {
    try {
      const journal = repo.get(this.location.params.name)
      await journal.index()
      const journalPage = journal.pages[parseInt(this.location.params.index)]

      this.html`
        <h1>${journalPage.title}, ${journal.title}</h1>

        ${journalPage.blocks
          .filter(block => block.block)
          .map(block => blockTypes[block.block].render(block.items))}
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