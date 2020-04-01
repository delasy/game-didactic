import Logger from './logger'
import map from './temp-map.json'

interface Store {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
}

interface Position {
  x: number
  y: number
}

interface Player {
  pos: Position
  lookAngle: number
  weapon: 1 | 2 | 3 | 4 | 5
}

const player: Player = {
  pos: map.spawn[0],
  lookAngle: 0,
  weapon: 1
}

const decimalAdjust = (
  type: 'ceil' | 'floor' | 'round',
  value: number,
  exp: number = 0
): number => {
  if (exp === 0) {
    return Math[type](value)
  }

  if (isNaN(value) || exp % 1 !== 0) {
    return NaN
  }

  const shiftArr = value.toString().split('e')

  const shift = shiftArr[0] + 'e' + String(
    shiftArr.length > 1 ? +shiftArr[1] - exp : -exp
  )

  const shiftBackArr = Math[type](+shift).toString().split('e')

  const shiftBack = shiftBackArr[0] + 'e' + String(
    shiftBackArr.length > 1 ? +shiftBackArr[1] + exp : exp
  )

  return +shiftBack
}

const findAngle = (
  cx: number = 0,
  cy: number = 0,
  ex: number = 0,
  ey: number = 0
): number => {
  const dy = ey - cy
  const dx = ex - cx
  const theta = Math.atan2(dy, dx) * (180 / Math.PI)
  const thetaReverted = theta

  return decimalAdjust('round', thetaReverted, -2)
}

const isInFullScreen = (): boolean => {
  return document.fullscreenElement !== null
}

const drawBackground = (store: Store): void => {
  const { canvas, ctx } = store

  ctx.fillStyle = 'gray'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

const drawPlayer = (store: Store): void => {
  drawPlayerBody(store)
  drawPlayerWeapon(store)
}

const drawMap = (store: Store): void => {
  drawMapBlocks(store)
}

const drawMapBlocks = (store: Store): void => {
  const { canvas, ctx } = store
  const size = 40

  for (const block of map.blocks) {
    const offsetX = (player.pos.x - block.x) * size
    const offsetY = (player.pos.y - block.y) * size
    const x = canvas.width / 2 - offsetX - size / 2
    const y = canvas.height / 2 - offsetY - size / 2

    ctx.fillStyle = '#000'
    ctx.fillRect(x, y, size, size)
  }
}

const drawPlayerBody = (store: Store): void => {
  const { canvas, ctx } = store
  const size = 40

  ctx.fillStyle = 'red'
  ctx.fillRect(
    canvas.width / 2 - size / 2,
    canvas.height / 2 - size / 2,
    size,
    size
  )
}

const drawPlayerWeapon = (store: Store): void => {
  const { canvas, ctx } = store
  const weaponLength = 34
  const lookAngle = player.lookAngle - 180

  const x = Math.cos(Math.PI * lookAngle / 180) * weaponLength
  const y = Math.sin(Math.PI * lookAngle / 180) * weaponLength

  ctx.beginPath()
  ctx.moveTo(canvas.width / 2, canvas.height / 2)
  ctx.lineTo(canvas.width / 2 + x, canvas.height / 2 + y)
  ctx.lineWidth = 5

  if (player.weapon === 1) {
    ctx.strokeStyle = 'rgba(0, 255, 0)'
  } else if (player.weapon === 2) {
    ctx.strokeStyle = 'rgba(255, 0, 255)'
  } else if (player.weapon === 3) {
    ctx.strokeStyle = 'rgba(0, 0, 255)'
  } else if (player.weapon === 4) {
    ctx.strokeStyle = 'rgba(0, 255, 255)'
  } else if (player.weapon === 5) {
    ctx.strokeStyle = 'rgba(255, 255, 255)'
  }

  ctx.stroke()
}

const update = (store: Store): void => {
  const { canvas, ctx } = store

  const updateFrame = (): void => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawBackground(store)
    drawMap(store)
    drawPlayer(store)

    window.requestAnimationFrame(updateFrame)
  }

  updateFrame()

  window.addEventListener('keydown', (ev: KeyboardEvent): void => {
    switch (ev.keyCode) {
      case 49: {
        player.weapon = 1

        break
      }
      case 50: {
        player.weapon = 2

        break
      }
      case 51: {
        player.weapon = 3

        break
      }
      case 52: {
        player.weapon = 4

        break
      }
      case 53: {
        player.weapon = 5

        break
      }
      case 70: {
        if (!document.fullscreenEnabled) {
          break
        }

        if (isInFullScreen()) {
          document.exitFullscreen().catch(Logger.error)
        } else {
          canvas.requestFullscreen().catch(Logger.error)
        }

        break
      }
    }
  })

  window.addEventListener('mousemove', (ev: MouseEvent): void => {
    const posX = ev.clientX - canvas.width / 2
    const posY = ev.clientY - canvas.height / 2

    player.lookAngle = findAngle(posX, posY)
  })

  window.addEventListener('resize', (): void => {
    store.canvas.height = window.innerHeight
    store.canvas.width = window.innerWidth

    updateFrame()
  })
}

export default (canvas: HTMLCanvasElement): void => {
  const height = window.innerHeight
  const width = window.innerWidth

  canvas.height = height
  canvas.style.display = 'block'
  canvas.width = width

  const ctx = canvas.getContext('2d')

  if (ctx !== null) {
    const store = { canvas, ctx, height, width }

    update(store)
  } else {
    Logger.warn('Something bad happened at place: 2')
  }
}
