import { define } from 'uce'
import { t } from '../core/translation'
import { journalRepository as repo } from '../repository/journalRepository'
import { RouterPage } from '../types'
import { ErrorNotFound } from '../core/errors'
import { Router } from '@vaadin/router'
import EditorJS, { ToolConstructable, ToolSettings } from '@editorjs/editorjs';
import Header from '@editorjs/header'; 
import List from '@editorjs/list';
import { useState } from '../helpers/useState'

import { Image } from '../plugins/Image'
import { Video } from '../plugins/Video'
import { Gpx } from '../plugins/Gpx'

const journalPageView: RouterPage = {
  async render() {
    try {
      const journal = repo.get(this.location.params.name)

      const journalPage = journal.pages[parseInt(this.location.params.index)]

      const editor = (element) => {
        if (element.initiated) return

        new EditorJS({
          holder: element,
          tools: { 
            header: Header, 
            list: List,
            image: Image as ToolConstructable | ToolSettings<any>,
            video: Video as ToolConstructable | ToolSettings<any>,
            gpx: Gpx as ToolConstructable | ToolSettings<any>,
          },
          data: {
            time: new Date().getTime(),
            blocks: [{
              type: 'header',
              id: 'title',
              data: {
                text: journalPage.title
              }
            }, ...journalPage.blocks]
          }
        });

        element.initiated = true
      }

      this.html`
        <div ref=${editor}></div>

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