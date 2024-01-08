const canvasSketch = require('canvas-sketch')
const math = require('canvas-sketch-util/math')
const random = require('canvas-sketch-util/random')
const tweakPane = require('tweakpane')


const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
}

const params = {
  count: 40,
  particleWidth: random.range(0.1, 2),
  particleHeight: random.range(0.2, 0.5),
  verticalMovement: 0 
}

const pickColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

const bgColor = pickColor()
const fillColor = pickColor()

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = bgColor
    context.fillRect(0, 0, width, height)

    context.fillStyle = fillColor

    const cx = width  * 0.5
		const cy = height * 0.5

    const w = width  * 0.01
		const h = height * 0.1

		const count = params.count
		const radius = width * 0.3
    const slice = math.degToRad(360 / count)
    
    let x, y

    for (let i = 0; i < count; i++) {
			const angle = slice * i

			x = cx + radius * Math.sin(angle)
			y = cy + radius * Math.cos(angle)

			context.save()
			context.translate(x, y)
			context.rotate(-angle)
			context.scale(params.particleWidth, params.particleHeight)

			context.beginPath()
			context.rect(-w * 0.5, random.range(0, -h * params.verticalMovement), w, h)
			// context.rect(-w * 0.5, -h * 0.25, w, h)
			context.fill()
			context.restore()

			context.save()
			context.translate(cx, cy)
			context.rotate(-angle)

			// context.lineWidth = random.range(5, 20)
			context.lineWidth = 12.5

			context.beginPath()
			// context.arc(0, 0, radius * random.range(0.7, 1.3), slice * random.range(1, -8), slice * random.range(1, 5))
			context.arc(0, 0, radius, slice * random.range(1, -8), slice * 2.5)

			context.restore()
    }
  }
}

const createPane = () => {
  const pane = new tweakPane.Pane()
  const f = pane.addFolder({ title: 'Particles'})
  f.addInput(params, 'count', { min: 1, max: 1000, step: 1 })
  f.addInput(params, 'particleWidth', { min: 0.1, max: 5 })
  f.addInput(params, 'particleHeight', { min: 0.1, max: 15 })
  f.addInput(params, 'verticalMovement', { min: 0, max: 5 })
}

createPane()
canvasSketch(sketch, settings)
