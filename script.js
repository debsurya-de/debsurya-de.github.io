const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

const canvas = document.querySelector('#field');
const context = canvas.getContext('2d');
const slider = document.querySelector('#strength');
const value = document.querySelector('#value');
const size = 39;
const midpoint = (size - 1) / 2;

// A fixed symmetric noise sample keeps changes in the signal visible.
function noise(row, column) {
  const hash = Math.sin(Math.min(row, column) * 17.31 + Math.max(row, column) * 71.23) * 43758.5453;
  return hash - Math.floor(hash) - 0.5;
}

function drawField() {
  const strength = Number(slider.value);
  value.textContent = 'λ = ' + strength.toFixed(1);
  const points = Array.from({ length: size }, (_, row) =>
    Array.from({ length: size }, (_, column) => {
      const x = (column - midpoint) / midpoint;
      const y = (row - midpoint) / midpoint;
      const signal = strength * Math.exp(-6 * (x * x + y * y));
      const height = signal + 0.48 * noise(row, column);
      return [420 + 188 * (x - y), 265 + 73 * (x + y) - 70 * height];
    })
  );

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = 1.3;
  // Paint from the far corner towards the viewer to hide occluded edges.
  for (let row = 0; row < size - 1; row++) {
    for (let column = 0; column < size - 1; column++) {
      const corners = [points[row][column], points[row + 1][column],
        points[row + 1][column + 1], points[row][column + 1]];
      context.beginPath();
      corners.forEach(([x, y], index) => {
        if (index === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      });
      context.closePath();
      context.fillStyle = '#132f34';
      context.fill();
      context.strokeStyle = points[row][column][1] < 205 ? '#e5d28c' : '#75d3bb';
      context.stroke();
    }
  }
}

if (context) {
  slider.addEventListener('input', drawField);
  drawField();
}
