import { randomInt } from "@/lib/utilities";

export type NodeData = {
  id: number;
  x: number;
  y: number;
  speedX: number;
  speedY: number;
  size: number;
  color?: string;
};

export function createNode(
  id: number,
  startX: number,
  startY: number,
  speed: number,
  nodeAmount: number,
  nodeSize: number
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

  return { id: id, x: startX, y: startY, speedX, speedY, size };
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
