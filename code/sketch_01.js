const canvasSketch = require('canvas-sketch');

const settings = {
  dimensions: [600, 600]
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = 'grey';
    context.fillRect(0, 0, width, height);

    let color = "green";
    context.strokeStyle = color;
    context.lineWidth = 5;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        let w = 60;
        let h = 60;
        let gap = 20;
        let x = 100 + (w + gap) * j;
        let y = 100 + (h + gap) * i;

        context.beginPath();
        context.rect(x, y, w, h);
        context.stroke();

        if (Math.random() < 0.5) {
          context.strokeStyle = "red";
          context.beginPath();
          context.arc(x+30, y+30, 20, 0, 2 * Math.PI);
          context.stroke();
          context.strokeStyle = color;
        }
      }
    }
  };
};

canvasSketch(sketch, settings);
