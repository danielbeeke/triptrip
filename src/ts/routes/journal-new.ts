import { html, render, define } from 'uce'
import { journalRepository as repo } from '../repository/journalRepository'
import { t } from '../core/translation'

define('journal-new', {
  render () {
    const newjournal = async () => {
      const journal = repo.create()
      await journal.chooseFolder()
      repo.save(journal)
    }

    this.html`
      <h1>${t`New journal`}</h1>

      <button onclick=${newjournal}>${t`Select folder`}</button>
    `
  }
})