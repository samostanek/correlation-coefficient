class Point {
  constructor(x, y, d = 10, color = [0, 0, 255]) {
    this.dragging = false;
    this.x = x;
    this.y = y;
    this.d = d;
    this.color = color;
  }

  render() {
    fill(...this.color);
    circle(this.x, this.y, this.d);
  }

  update() {
    if (this.dragging) {
      this.x = Math.min(Math.max(mouseX + this.offsetX, 0), width);
      this.y = Math.min(Math.max(mouseY + this.offsetY, 0), height);
    }
  }

  isWithin(x, y) {
    return dist(this.x, this.y, x, y) < this.d;
  }

  moveBy(x, y) {
    this.x += x;
    this.y += y;
  }
  pressed() {
    if (this.isWithin(mouseX, mouseY)) {
      this.dragging = true;
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }
  released() {
    this.dragging = false;
  }
}