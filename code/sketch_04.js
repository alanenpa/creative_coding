const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random')
const math = require('canvas-sketch-util/math')
const tweakPane = require('tweakpane')

const settings = {
  dimensions: [ 1080, 1080 ],
  animate: true
};

const pickColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16)
}

const params = {
  bgColor: pickColor(),
  strokeColor: pickColor(),
  cols: 10,
  rows: 10,
  scaleMin: 1,
  scaleMax: 30,
  freq: 0.003,
  amp: 0.2,
  animate: true,
  frame: 0,
  lineCap: 'butt'
}

const sketch = () => {
  return ({ context, width, height, frame }) => {
    context.fillStyle = params.bgColor;
    // context.fillStyle = 'white';
    context.fillRect(0, 0, width, height);
    context.strokeStyle = params.strokeColor

    const cols = params.cols
    const rows = params.rows
    const cells = cols * rows
    
    const gridWidth = width * 0.8
    const gridHeight = height * 0.8
    const cellWidth = gridWidth / cols
    const cellHeight = gridHeight / rows
    const marginX = (width - gridWidth) * 0.5
    const marginY = (height - gridHeight) * 0.5

    for (let i = 0; i < cells; i++) {
      const col = i % cols
      const row = Math.floor(i / cols)

      const x = col * cellWidth
      const y = row * cellHeight
      const width = cellWidth * 0.8
      const height = cellHeight * 0.8

      const f = params.animate ? frame : params.frame

      const n = random.noise3D(x, y, f * 10, params.freq)
      const angle = n * Math.PI * params.amp

      const scale = math.mapRange(n, -1, 1, params.scaleMin, params.scaleMax)

      context.save()
      context.translate(x, y)
      context.translate(marginX, marginY)
      context.translate(cellWidth * 0.5, cellHeight * 0.5)
      context.rotate(angle)

      context.lineWidth = scale
      context.lineCap = params.lineCap

      context.beginPath()
      context.moveTo(width * -0.5, 0)
      context.lineTo(height * 0.5, 0)
      context.stroke()

      context.restore()


    }
  };
};

const createPane = () => {
  const pane = new tweakPane.Pane()
  let folder = pane.addFolder({
    title: 'Grid'
  })
  folder.addInput(params, 'bgColor', {
    picker: 'inline'
  })
  folder.addInput(params, 'strokeColor', {
    picker: 'inline'
  })
  folder.addInput(params, 'lineCap', { options: { butt: 'butt', round: 'round', square: 'square'}})
  folder.addInput(params, 'cols', { min: 2, max: 50, step: 1 })
  folder.addInput(params, 'rows', { min: 2, max: 50, step: 1 })
  folder.addInput(params, 'scaleMin', { min: 1, max: 100 })
  folder.addInput(params, 'scaleMax', { min: 1, max: 100 })

  folder = pane.addFolder({
    title: 'Noise'
  })
  folder.addInput(params, 'freq', { min: -0.01, max: 0.01 })
  folder.addInput(params, 'amp', { min: 0, max: 1 })
  folder.addInput(params, 'animate')
  folder.addInput(params, 'frame', { min: 0, max: 999, step: 1 })
}

createPane()
canvasSketch(sketch, settings);
