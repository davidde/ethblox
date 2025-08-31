import { RefObject } from 'react';
import { createNode, NodeData } from './node';
import { randomInt } from '@/lib/utilities';


// Settings:
const nodeSize = 3; // medium node radius in pixels
const lineWidth = 2; // node connection line width in pixels
// Node amounts responsive with canvas size:
const nodeAmountMultiplierDesktop = 100;
const nodeAmountMultiplierMobile = 175;
// Speed multipliers responsive with canvas size:
const speedMultiplierDesktop = 190;
const speedMultiplierMobile = 100;
// Distance thresholds for drawing the lines between nodes; higher = more lines:
const drawLineThresholdDesktop = 110;
const drawLineThresholdMobile = 90;

// Set up all canvas and node data:
export function setupCanvas(
  canvas: HTMLCanvasElement,
  nodesRef: RefObject<NodeData[]>,
  nodeColor: string,
) {
  const width = window.innerWidth; // Set node canvas width
  const height = Number(window.getComputedStyle(document.body).getPropertyValue('--node-banner-height'));
  canvas.width = width;
  canvas.height = height;

  const isMobile = width <= 768; // Tailwind `md:` = `@media (width >= 48rem)` = 768px
  const nodeAmountUnit = (width * height) / 900000;
  const nodeAmount = isMobile ?
    Math.floor(nodeAmountUnit * nodeAmountMultiplierMobile) :
    Math.floor(nodeAmountUnit * nodeAmountMultiplierDesktop);
  const drawLineThreshold = isMobile ? drawLineThresholdMobile : drawLineThresholdDesktop;
  const baseSpeed = nodeAmount / (nodeAmountUnit * 100000);
  const speed = isMobile ?
    baseSpeed * speedMultiplierMobile :
    baseSpeed * speedMultiplierDesktop;

  // Reset the nodes for resize event listener:
  nodesRef.current = [];

  // Generate 'nodeAmount' number of nodes with random positions and push them to the nodes array:
  for (var i = 0; i < nodeAmount; i++) {
    const node = createNode(
      i,
      randomInt(0, width),
      randomInt(0, height),
      speed,
      nodeAmount,
      nodeSize,
      nodeColor,
    );
    nodesRef.current.push(node);
  }

  return {
    width,
    height,
    drawLineThreshold,
    lineWidth,
    nodesRef,
  };
}
