'use client';

import { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';


type Props = {
  className: string,
}

export default function NodeBanner(props: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const { resolvedTheme } = useTheme();

  let nodes: Node[] = []; // node array
  let width: number; // node canvas width in pixels
  let height: number; // node canvas height in pixels
  let nodeAmount: number;
  let drawLineThreshold: number;
  let speed: number;
  let bgColor: string;
  let nodeColor: string;
  let lineColor: string;

  // Settings:
  const colored = false; // gives nodes random colors when true, nodeColor when false
  const nodeSize = 3; // medium node radius in pixels
  const lineWidth = 2; // node connection line width in pixels
  const speedMultiplier = 0.2; // speed multiplier
  const nodeAmountMax = 100; // node amount on desktop, will be less on mobile; the more the slower
  const drawLineThresholdMax = 100; // distance threshold for drawing the lines between nodes on desktop; higher = more lines = slower
  const heightMax = 460; // node canvas height in pixels on desktop, will be smaller on mobile

  // Node class and constructor:
  class Node {
    x: number; y: number; id: number;
    speedX: number; speedY: number;
    size: number;
    color: string;
    move: () => void;
    draw: () => void;

    constructor(x: number, y: number, id: number, context: CanvasRenderingContext2D) {
      this.x = x;
      this.y = y;
      this.id = id;

      // If the node id is even, start moving them in the opposite direction:
      if (isEven(id)) {
        this.speedX = randomInt(1, 100)/100 * speed;
        this.speedY = randomInt(1, 100)/100 * speed;
      } else {
        this.speedX = randomInt(1, 100)/100 * speed * -1;
        this.speedY = randomInt(1, 100)/100 * speed * -1;
      }

      this.size = nodeSize;

      // Color array for random color setting:
      const colors = ['#4f91f9', '#a7f94f', '#f94f4f', '#f9f74f', '#8930ff', '#fc4edf', '#ff9c51'];
      // Set random color from array if colored is true:
      this.color = colored ? colors[Math.floor(Math.random() * colors.length)] : nodeColor;

      this.move = function() {
        this.y += this.speedY;
        this.x += this.speedX;

        // Make them bounce:
        if (this.y < 1 || this.y > height - nodeSize * 2) {
          this.speedY = - this.speedY;
        }
        if (this.x < 1 || this.x > width - nodeSize * 2) {
          this.speedX = - this.speedX;
        }
      };

      // Draw the nodes:
      this.draw = function() {
        context.fillStyle = this.color;
        // Create some variation in node sizes:
        if (this.id <= Math.floor(nodeAmount * 0.25))
          circle(this.x, this.y, nodeSize - 1, context);
        else if (this.id > Math.floor(nodeAmount * 0.75))
          circle(this.x, this.y, nodeSize + 1.5, context);
        else
          circle(this.x, this.y, nodeSize, context);
        context.fill();
      };
    }
  }

  useEffect(() => {
    const canvas = ref.current;
    if (canvas == null) return; // ref is null before render
    const context = canvas.getContext('2d')!;

    // Wait 1 millisec in order for CSS vars to be updated on theme switch;
    // otherwise it appears to use the CSS vars of the old theme that was switched away from!
    setTimeout(() => {
      bgColor = window.getComputedStyle(document.documentElement).getPropertyValue('--banner-bg-color');
      nodeColor = window.getComputedStyle(document.documentElement).getPropertyValue('--banner-node-color');
      lineColor = window.getComputedStyle(document.documentElement).getPropertyValue('--banner-line-color');

      setupCanvasWithNodes(context, canvas);
      loop(context);
    }, 1);

    // Resize event listener:
    let onResize = () => setupCanvasWithNodes(context, canvas);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [resolvedTheme])

  function setupCanvasWithNodes(context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    width = window.innerWidth; // Set node canvas width
    let isMobile = width <= 768;
    nodeAmount = isMobile ? Math.floor(0.4 * nodeAmountMax) : nodeAmountMax;
    drawLineThreshold = isMobile ? 0.9 * drawLineThresholdMax : drawLineThresholdMax;
    speed = isMobile ? 0.7 * speedMultiplier : speedMultiplier;
    height = isMobile ? 0.75 * heightMax : heightMax;
    canvas.width = width;
    canvas.height = height;
    clearCanvas(context);

    // Reset the nodes:
    nodes = [];

    // Generate 'nodeAmount' number of nodes with random positions and push them to the nodes array:
    for (var i = 0; i < nodeAmount; i++) {
      var node = new Node(randomInt(0, width), randomInt(0, height), i, context);
      nodes.push(node);
    }

    // Set the nodes up:
    for (var i = 0; i < nodes.length; i++){
      nodes[i].move();
      nodes[i].draw();
    }
  }

  // Return random int from min to max inclusive:
  function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Clear the canvas from nodes and lines:
  function clearCanvas(context: CanvasRenderingContext2D) {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);
  }

  // Draw the lines between the nodes:
  function drawLines(context: CanvasRenderingContext2D) {
    for (var i = 0; i < nodes.length; i++) {
      // Get the origin point:
      var x1 = nodes[i].x;
      var y1 = nodes[i].y;

      // Get the destination point in a subloop that only loops the remaining nodes, to avoid duplicate lines:
      for (var j = i; j < nodes.length; j++) {
        // Get the destination point:
        var x2 = nodes[j].x;
        var y2 = nodes[j].y;

        // Calculate the distance between the origin and target points:
        var dist = distance(x1, x2, y1, y2);

        // If the distance is less than the threshold, draw the lines:
        if (dist < drawLineThreshold) {
          let finalOpacity = map_range(dist, 0, drawLineThreshold, 1, 0);
          if (colored) lineColor = nodes[i].color;
          let rgbValues = lineColor.startsWith('rgb') ? rgbToRgbNum(lineColor) : hexToRgbNum(lineColor);
          let color = 'rgba(' + rgbValues!.r + ',' + rgbValues!.g + ',' + rgbValues!.b + ',' + finalOpacity + ')';

          context.strokeStyle = color;
          line(x1, y1, x2, y2, context);
        }
      }
    }
  }

  // Loop function to animate the canvas:
  function loop(context: CanvasRenderingContext2D) {
    clearCanvas(context);

    // Move each node and draw it:
    for (var i = 0; i < nodes.length; i++){
      nodes[i].move();
      nodes[i].draw();
    }

    drawLines(context); // Draw lines again

    // Repeat loop:
    requestAnimationFrame(() => loop(context));
  }

  // Draw circle given x, y and radius:
  function circle(x: number, y: number, radius: number, context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.closePath();
  }

  // Draw line given a set of two points (as x1, y1, x2 and y2):
  function line(x1: number, y1: number, x2: number, y2: number, context: CanvasRenderingContext2D){
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  // Calculate the distance between two points:
  function distance(x1: number, x2: number, y1: number, y2: number){
    var xDist = x2 - x1;
    var yDist = y2 - y1;
    return Math.sqrt(xDist * xDist + yDist * yDist);
  }

  // range a numbers given a value and two ranges:
  function map_range(value: number, low1: number, high1: number, low2: number, high2: number) {
    return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

  // Check if n is even:
  function isEven(n: number) {
    return !(n % 2);
  }

  // Convert from hex string to rgb number:
  function hexToRgbNum(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }

  // Convert from rgb() string to rgb number:
  function rgbToRgbNum(rgb: string) {
    var result = /^rgb\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)$/i.exec(rgb);
    return result ? {
        r: parseInt(result[1]),
        g: parseInt(result[2]),
        b: parseInt(result[3])
    } : null;
  }

  return (
    <canvas className={props.className} ref={ref} />
  );
}