import { Router } from '@vaadin/router';
import './core/router'

const errorHandler = async function(event) { 
    if (event.reason.toString().includes('User activation is required to request permissions.')) {
        Router.go('/journal')
    }

    console.log(event)
}

window.addEventListener('unhandledrejection', errorHandler)
window.addEventListener('rejectionhandled', errorHandler)
window.addEventListener('error', errorHandler)
