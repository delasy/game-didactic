import Logger from './logger'
import main from './main'

const app = document.getElementById('app')

if (app !== null) {
  const canvas = document.createElement('canvas')

  app.appendChild(canvas)

  main(canvas)
} else {
  Logger.warn('Something bad happened at place: 1')
}
