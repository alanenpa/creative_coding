const canvasSketch = require('canvas-sketch')
const random = require('canvas-sketch-util/random')
const math = require('canvas-sketch-util/math')

const settings = {
  dimensions: [1080, 1080],
  animate: true
}

const sketch = ({ context, width, height }) => {
  const agents = []

  for (let i = 0; i < 50; i++) {
    const x = random.range(0, width)
    const y = random.range(0, height)
    agents.push(new Agent(x, y))
  }

  return () => {
    context.fillStyle = 'white'
    context.fillRect(0, 0, width, height)

    for (let i = 0; i < agents.length; i++) {
      const start = agents[i]

      for (let j = i + 1; j < agents.length; j++) {
        const end = agents[j]

        const dist = start.pos.distanceTo(end.pos)

        if (dist > 220) continue;

        context.lineWidth = math.mapRange(dist, 0, 220, 12, 0)

        context.beginPath()
        context.moveTo(start.pos.x, start.pos.y)
        context.lineTo(end.pos.x, end.pos.y)
        context.stroke()
      }

    }

    agents.forEach(agent => {
      agent.update()
      agent.draw(context)
      // agent.bounce(width, height)
      agent.wrap(width, height)
    })
  }
}

class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  distanceTo(v) {
    const dx = this.x - v.x
    const dy = this.y - v.y
    return Math.sqrt(dx * dx + dy * dy)
  }
}

class Agent {
  constructor(x, y) {
    this.pos = new Vector(x, y)
    this.vel = new Vector(random.range(-1, 1), random.range(-1, 1))
    this.radius = random.range(3, 15)
  }

  bounce(width, height) {
    if (this.pos.x < 0 || this.pos.x >= width) this.vel.x *= -1
    if (this.pos.y < 0 || this.pos.y >= height) this.vel.y *= -1
  }

  wrap(width, height) {
    const curX = this.pos.x
    const curY = this.pos.y
    if (curX > width) this.pos.x = 0
    if (curX < 0) this.pos.x = width
    if (curY > height) this.pos.y = 0
    if (curY < 0) this.pos.y = height
    if (this.pos.y > height) this.pos.y = 0
  }

  update() {
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
  }

  draw(context) {
    context.save()
    context.lineWidth = 4

    context.beginPath()
    context.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
    context.fill()
    context.stroke()
    context.restore()
  }
}

const pickColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

canvasSketch(sketch, settings)

