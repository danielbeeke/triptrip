import { html, render, define } from 'uce'
import { t } from '../core/translation'
import { journalRepository as repo } from '../repository/journalRepository'

define('journal-list', {
  render() {
    const journals = repo.getAll()

    this.html`
      <h1>${t`journals`}</h1>

      <a href="/journal/new">${t`Create new`}</a>

      <ul>
      ${journals.map(journal => html`
        <li>
          <a href=${`/journal/${journal.id}`}>
            <h3>${journal.title}</h3>
          </a>
        </li>
      `)}
      </ul>
    `
  },
})