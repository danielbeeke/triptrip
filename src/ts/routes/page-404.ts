import { html, render, define } from 'uce'
import { t } from '../core/translation'
import { journalRepository as repo } from '../repository/journalRepository'

define('page-404', {
  render() {
    this.html`404`
  },
})