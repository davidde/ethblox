import { RefObject } from 'react';


// Settings:
const nodeSize = 3; // medium node radius in pixels
const lineWidth = 2; // node connection line width in pixels
const speedMultiplier = 0.2; // speed multiplier
const nodeAmountMax = 100; // node amount on desktop, will be less on mobile; the more the slower
const drawLineThresholdMax = 100; // distance threshold for drawing the lines between nodes on desktop; higher = more lines = slower


// Set up all canvas and node data:
export function setupCanvas(canvas: HTMLCanvasElement) {
  const width = window.innerWidth; // Set node canvas width
  const height = Number(window.getComputedStyle(document.body).getPropertyValue('--node-banner-height'));
  canvas.width = width;
  canvas.height = height;

  const isMobile = width <= 768; // Tailwind `md:` = `@media (width >= 48rem)` = 768px
  const nodeAmount = isMobile ? Math.floor(0.4 * nodeAmountMax) : nodeAmountMax;
  const drawLineThreshold = isMobile ? 0.9 * drawLineThresholdMax : drawLineThresholdMax;
  const speed = isMobile ? 0.7 * speedMultiplier : speedMultiplier;
  const nodes = []; // Reset the nodes for resize event listener

  // Generate 'nodeAmount' number of nodes with random positions and push them to the nodes array:
  for (var i = 0; i < nodeAmount; i++) {
    var node = new Node(
      i,
      randomInt(0, width),
      randomInt(0, height),
      speed,
      nodeAmount,
      width,
      height
    );
    nodes.push(node);
  }

  return {
    width,
    height,
    drawLineThreshold,
    lineWidth,
    nodes,
  };
}

// Node class and constructor:
export class Node {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  color: string | undefined;
  move: () => void;

  constructor(
    id: number,
    x: number,
    y: number,
    speed: number,
    nodeAmount: number,
    width: number,
    height: number,
  ) {
    this.x = x;
    this.y = y;
    this.id = id;

    // If the node id is even, start moving them in the opposite direction:
    if (id % 2) {
      this.speedX = randomInt(1, 100)/100 * speed;
      this.speedY = randomInt(1, 100)/100 * speed;
    } else {
      this.speedX = randomInt(1, 100)/100 * speed * -1;
      this.speedY = randomInt(1, 100)/100 * speed * -1;
    }

    // Create some variation in node sizes:
    this.size = this.id > Math.floor(nodeAmount * 0.75) ? nodeSize + 1.5 :
                this.id <= Math.floor(nodeAmount * 0.25) ? nodeSize - 1 : nodeSize;

    // Move the nodes and draw them:
    this.move = function() {
      this.y += this.speedY;
      this.x += this.speedX;

      // Make them bounce:
      if (this.y < this.size || this.y > height - this.size) {
        this.speedY = - this.speedY;
      }
      if (this.x < this.size || this.x > width - this.size) {
        this.speedX = - this.speedX;
      }
    };
  }
}

// Return random int from min to max inclusive:
function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
