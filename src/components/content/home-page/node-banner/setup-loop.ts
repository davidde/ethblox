import { CanvasData, ColorData } from '.';


// Give nodes random colors when true, nodeColor when false:
const useRandomColor = false;
// Color array for random color setting:
const COLORS = ['#4f91f9', '#a7f94f', '#f94f4f', '#f9f74f', '#8930ff', '#fc4edf', '#ff9c51'];


// Loop function to animate the canvas:
export function setupLoop(
  context: CanvasRenderingContext2D,
  canvasData: CanvasData,
  colorData: ColorData,
) {
  // Create linear gradient for canvas background:
  let linearGradient = context.createLinearGradient(0, 0, 0, canvasData.height);
  // Create radial gradient for canvas background:
  let radialGradient = context.createRadialGradient(
    canvasData.width / 3.1, // x0: x position of inner circle’s center (focus point)
    canvasData.height / 2.6, // y0: y position of inner circle’s center (focus point)
    0, // r0: Radius of the inner circle (start radius)
    canvasData.width / 3.1, // x1: x position of outer circle’s center
    canvasData.height / 2.6,// y1: y position of the outer circle’s center
    canvasData.width / 5 // r1: Radius of the outer circle (end radius)
  );

  // Set up loop:
  requestAnimationFrame(loop);

  function loop() {
    // Clear the entire canvas every frame:
    context.clearRect(0, 0, canvasData.width, canvasData.height); 

    // Redraw the linear gradient background every frame:
    // (Before canvasData.nodes and lines, so they appear on top of it)
    linearGradient.addColorStop(0.0, colorData.bgColor);
    linearGradient.addColorStop(0.8, colorData.bgColor); // Start color transition at 80%
    linearGradient.addColorStop(1.0, colorData.linearGradientToColor);
    context.fillStyle = linearGradient;
    context.fillRect(0, 0, canvasData.width, canvasData.height);

    // Draw all nodes:
    drawNodes();
    // Move the nodes:
    for (let i = 0; i < canvasData.nodes.length; i++) canvasData.nodes[i].move();
    // Draw the lines:
    drawLines();

    // Redraw the circle gradient background every frame:
    // (After nodes and lines, so they appear under it)
    radialGradient.addColorStop(0, `rgba(255, 255, 255, ${colorData.radialGradientTransparency})`); // Bright center
    radialGradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Fade to transparent
    context.fillStyle = radialGradient;
    context.fillRect(0, 0, canvasData.width, canvasData.height);

    // Repeat the loop:
    requestAnimationFrame(loop);
  }

  function drawNodes() {
    for (const node of canvasData.nodes) {
      // Set random color from array if colored is true:
      node.color = useRandomColor? COLORS[Math.floor(Math.random() * COLORS.length)] : colorData.nodeColor;
      context.fillStyle = node.color;

      // Draw the nodes:
      context.beginPath();
      // x position, y position, radius, startAngle, endAngle:
      context.arc(node.x, node.y, node.size, 0, 2 * Math.PI);
      context.closePath();
      context.fill();
    }
  }

  // Draw the lines between the nodes:
  function drawLines() {
    // Get the rgb values for the color of the line:
    let rgbValues = colorData.lineColor.startsWith('rgb') ? rgbToRgbNums(colorData.lineColor) : hexToRgbNums(colorData.lineColor);

    for (let i = 0; i < canvasData.nodes.length; i++) {
      if (useRandomColor) rgbValues = canvasData.nodes[i].color?.startsWith('rgb') ?
        rgbToRgbNums(canvasData.nodes[i].color) : hexToRgbNums(canvasData.nodes[i].color);

      // Get the origin point:
      let x1 = canvasData.nodes[i].x;
      let y1 = canvasData.nodes[i].y;

      // Get the destination point in a subloop that only loops the remaining canvasData.nodes, to avoid duplicate lines:
      for (let j = i+1; j < canvasData.nodes.length; j++) {
        // Get the destination point:
        let x2 = canvasData.nodes[j].x;
        let y2 = canvasData.nodes[j].y;

        // Calculate the distance between the origin and target points:
        let dist = distance(x1, x2, y1, y2);

        // If the distance is less than the threshold, draw the line:
        if (dist < canvasData.drawLineThreshold) {
          let finalOpacity = 1 - (dist / canvasData.drawLineThreshold);
          context.strokeStyle = `rgba(${rgbValues!.r}, ${rgbValues!.g}, ${rgbValues!.b}, ${finalOpacity})`;
          line(x1, y1, x2, y2);
        }
      }
    }
  }

  // Draw line given a set of two points (as x1, y1, x2 and y2):
  function line(x1: number, y1: number, x2: number, y2: number) {
    context.lineWidth = canvasData.lineWidth;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }
}

// Calculate the distance between two points:
function distance(x1: number, x2: number, y1: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Convert from hex string to rgb number:
function hexToRgbNums(hex?: string) {
  if (!hex) return null;

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
}

// Convert from rgb() string to rgb number:
function rgbToRgbNums(rgb?: string) {
  if (!rgb) return null;

  var result = /^rgb\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)$/i.exec(rgb);
  return result ? {
      r: parseInt(result[1]),
      g: parseInt(result[2]),
      b: parseInt(result[3])
  } : null;
}
