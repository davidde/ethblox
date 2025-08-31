import { hexToRgbNums, randomInt, rgbToRgbNums } from '@/lib/utilities';


// Give nodes random colors when true, nodeColor when false:
let useRandomColor = false;
// Color array for random color setting:
const COLORS = ['#4f91f9', '#a7f94f', '#f94f4f', '#f9f74f', '#8930ff', '#fc4edf', '#ff9c51'];

export type NodeData = {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  color: string;
};

export function createNode(
  id: number,
  x: number,
  y: number,
  speed: number,
  nodeAmount: number,
  nodeSize: number,
  nodeColor: string,
): NodeData {
  let speedX: number;
  let speedY: number;

  // If the node id is even, start moving them in the opposite direction:
  if (id % 2) {
    speedX = randomInt(1, 100) / 100 * speed;
    speedY = randomInt(1, 100) / 100 * speed;
  } else {
    speedX = randomInt(1, 100) / 100 * speed * -1;
    speedY = randomInt(1, 100) / 100 * speed * -1;
  }

  // Create some variation in node sizes:
  const size = id > Math.floor(nodeAmount * 0.75) ? nodeSize + 1.5 :
               id <= Math.floor(nodeAmount * 0.25) ? nodeSize - 1 : nodeSize;

  // Set random color from array if `useRandomColor` is true:
  const color = useRandomColor ? COLORS[Math.floor(Math.random() * COLORS.length)] : nodeColor;

  return { id, x, y, speedX, speedY, size, color };
}

export function drawNodes(
  context: CanvasRenderingContext2D,
  nodes: NodeData[],
) {
  for (const node of nodes) {
    context.fillStyle = node.color;

    // Draw the nodes:
    context.beginPath();
    // x position, y position, radius, startAngle, endAngle:
    context.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
  }
}

export function updateNodes(nodes: NodeData[], width: number, height: number) {
  for (let node of nodes) {
    node.x += node.speedX;
    node.y += node.speedY;

    // Bounce
    if (node.y < node.size || node.y > height - node.size) {
      node.speedY = - node.speedY;
    }
    if (node.x < node.size || node.x > width - node.size) {
      node.speedX = - node.speedX;
    }
  }
}

// Draw the lines between the nodes:
export function drawLines(
  context: CanvasRenderingContext2D,
  nodes: NodeData[],
  lineColor: string,
  lineWidth: number,
  drawLineThreshold: number,
) {
  // Get the rgb values for the color of the line:
  let rgbValues = lineColor.startsWith('rgb') ? rgbToRgbNums(lineColor) : hexToRgbNums(lineColor);

  for (let i = 0; i < nodes.length; i++) {
    if (useRandomColor) rgbValues = nodes[i].color?.startsWith('rgb') ?
      rgbToRgbNums(nodes[i].color) : hexToRgbNums(nodes[i].color);

    // Get the origin point:
    let x1 = nodes[i].x;
    let y1 = nodes[i].y;

    // Get the destination point in a subloop that only loops the remaining nodes, to avoid duplicate lines:
    for (let j = i+1; j < nodes.length; j++) {
      // Get the destination point:
      let x2 = nodes[j].x;
      let y2 = nodes[j].y;

      // Calculate the distance between the origin and target points:
      let dist = distance(x1, y1, x2, y2);

      // If the distance is less than the threshold, draw the line:
      if (dist < drawLineThreshold) {
        let finalOpacity = 1 - (dist / drawLineThreshold);
        context.strokeStyle = `rgba(${rgbValues!.r}, ${rgbValues!.g}, ${rgbValues!.b}, ${finalOpacity})`;
        context.lineWidth = lineWidth;
        // Draw line given a set of two points (as x1, y1, x2 and y2):
        context.beginPath();
        context.moveTo(x1, y1);
        context.lineTo(x2, y2);
        context.stroke();
      }
    }
  }
}

// Calculate the distance between two points:
function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}
