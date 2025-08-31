import { CanvasData, ColorData } from '.';
import { drawLines, drawNodes, updateNodes } from './node';


// Loop function to animate the canvas:
export function setupLoop(
  context: CanvasRenderingContext2D,
  canvasData: CanvasData,
  colorData: ColorData,
) {
  let frameId: number | null = null;
  const { width, height } = canvasData;
  const nodes = canvasData.nodesRef.current;

  // Create linear gradient for canvas background:
  const linearGradient = context.createLinearGradient(0, 0, 0, height);
  // Create radial gradient for canvas background:
  const radialGradient = context.createRadialGradient(
    width / 3.1, // x0: x position of inner circle’s center (focus point)
    height / 2.6, // y0: y position of inner circle’s center (focus point)
    0, // r0: Radius of the inner circle (start radius)
    width / 3.1, // x1: x position of outer circle’s center
    height / 2.6,// y1: y position of the outer circle’s center
    width / 5 // r1: Radius of the outer circle (end radius)
  );

  function loop() {
    // Clear the entire canvas every frame:
    context.clearRect(0, 0, width, height);

    // Redraw the linear gradient background every frame:
    // (Before canvasData.nodes and lines, so they appear on top of it)
    linearGradient.addColorStop(0.0, colorData.bgColor);
    linearGradient.addColorStop(0.8, colorData.bgColor); // Start color transition at 80%
    linearGradient.addColorStop(1.0, colorData.linearGradientToColor);
    context.fillStyle = linearGradient;
    context.fillRect(0, 0, width, height);

    // Draw all nodes:
    drawNodes(context, nodes);
    // Update all nodes:
    updateNodes(nodes, width, height);
    // Draw the lines:
    drawLines(context, nodes, colorData.lineColor, canvasData.lineWidth, canvasData.drawLineThreshold);

    // Redraw the circle gradient background every frame:
    // (After nodes and lines, so they appear under it)
    radialGradient.addColorStop(0, `rgba(255, 255, 255, ${colorData.radialGradientTransparency})`); // Bright center
    radialGradient.addColorStop(1, 'rgba(255, 255, 255, 0)'); // Fade to transparent
    context.fillStyle = radialGradient;
    context.fillRect(0, 0, width, height);

    // Repeat the loop, and save frame ID:
    frameId = requestAnimationFrame(loop);
  }

  return {
    start() {
      if (frameId == null) {
        loop();
      }
    },
    stop() {
      if (frameId != null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    },
  };
}
