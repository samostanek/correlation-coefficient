const points = []
/** Height Fraction */
const hf = 0.9;
let linRegLinePoints = [0, 0, 10, 10];

function setup() {
  createCanvas(windowWidth, Math.floor(hf * windowHeight / 10) * 10);
}

function draw() {
  background(255);
  stroke(0);
  // draw the correlation coefficient in the top right corner
  text(`Korelačný koeficient: ${getCC().toFixed(3)}`, width - 150, 20);
  // draw the regression line
  strokeWeight(2);
  line(...linRegLinePoints);
  // draw horizontal scale with labeled tick marks
  strokeWeight(1);
  fill(0);
  push();
  translate(30, 0);
  textAlign(LEFT)
  line(-5, height - 20, width, height - 20);
  for (let i = 0; i <= width; i += 50) {
    line(i, height - 15, i, height - 25);
    text(i, i, height);
  }
  // draw vertical scale with tick marks
  textAlign(RIGHT)
  line(0, 0, 0, height - 20);
  for (let i = 0; i < height; i += 50) {
    line(-5, i, 5, i);
    text(height - i, -8, i);
  }
  pop();
  points.forEach(p => p.update());
  linRegUpdate();
  points.forEach(p => p.render());
}

function mouseClicked() {
  for (p of points) {
    if (p.isWithin(mouseX, mouseY)) return;
  }
  points.push(new Point(mouseX, mouseY));
}

function mousePressed() {
  points.forEach(p => p.pressed());
}

function mouseReleased() {
  points.forEach(p => p.released());
}

function windowResized() {
  resizeCanvas(windowWidth, Math.floor(hf * windowHeight / 10) * 10);
}

function linRegUpdate() {
  let { m, b } = ss.linearRegression(points.map(p => [p.x, p.y]));
  // console.log(x, y, m, b);
  linRegLinePoints = [0, b, width, m * width + b];
}

function getCC() {
  if (!points.length) return NaN;
  const n = points.length;
  const x = points.map(p => p.x);
  const y = points.map(p => p.y);
  const xMean = x.reduce((a, b) => a + b) / n;
  const yMean = y.reduce((a, b) => a + b) / n;
  const sX = Math.sqrt(x.map(xp => (xp - xMean) ** 2).reduce((a, b) => a + b) / n);
  const sY = Math.sqrt(y.map(yp => (yp - yMean) ** 2).reduce((a, b) => a + b) / n);
  const covariant = points.map(p => (p.x - xMean) * (p.y - yMean)).reduce((a, b) => a + b) / (points.length);
  if (sX === 0 || sY === 0) return Infinity;
  return -covariant / (sX * sY);
}