import { Router } from '@vaadin/router';

import '../routes/journal-new'
import '../routes/journal-list'
import '../routes/journal-view'
import '../routes/journal-page-view'
import '../routes/page-404'

export const router = new Router(document.body)

router.setRoutes([
  { path: '/', redirect: '/journal' },
  { path: '/journal/new', component: 'journal-new' },
  { path: '/journal', component: 'journal-list' },
  { path: '/journal/:name', component: 'journal-view' },
  { path: '/journal/:name/:index', component: 'journal-page-view' },
  { path: '(.*)', component: 'page-404'}
])
