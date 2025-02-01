'use client';

import { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';


type Props = {
  className: string,
}

export default function NodeBanner(props: Props) {
  // Settings:
  const colored = false; // gives nodes random colors when true, nodeColor when false
  const nodeSize = 3; // medium node radius in pixels
  const lineWidth = 2; // node connection line width in pixels
  const speedMultiplier = 0.2; // speed multiplier
  const nodeAmountMax = 100; // node amount on desktop, will be less on mobile; the more the slower
  const drawLineThresholdMax = 100; // distance threshold for drawing the lines between nodes on desktop; higher = more lines = slower
  const heightMax = 460; // node canvas height in pixels on desktop, will be smaller on mobile
  const { resolvedTheme } = useTheme(); // theme is required to update NodeBanner colors on theme switch
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) return; // canvas ref is null before render
    const context = canvas.current.getContext('2d')!;

    // Node class and constructor:
    class Node {
      x: number; y: number; id: number;
      speedX: number; speedY: number;
      size: number;
      color: string;
      move: () => void;

      constructor(x: number, y: number, id: number) {
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

        // Color array for random color setting:
        const colors = ['#4f91f9', '#a7f94f', '#f94f4f', '#f9f74f', '#8930ff', '#fc4edf', '#ff9c51'];
        // Set random color from array if colored is true:
        this.color = colored ? colors[Math.floor(Math.random() * colors.length)] : nodeColor;

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

          // Draw the nodes:
          context.fillStyle = this.color;
          circle(this.x, this.y, this.size);
          context.fill();
        };
      }
    }

    let nodes: Node[] = []; // node array
    let width: number; // node canvas width in pixels
    let height: number; // node canvas height in pixels
    let nodeAmount: number;
    let drawLineThreshold: number;
    let speed: number;
    let bgColor: string, nodeColor: string, lineColor: string;

    // This conditional fixes the CSS vars update on theme switch;
    // when getting the CSS vars directly from document.documentElement,
    // it uses the CSS vars of the old theme that was switched away from!
    if (resolvedTheme === 'light') {
      const light = document.querySelector('.light')!;
      bgColor = window.getComputedStyle(light).getPropertyValue('--banner-bg-color')
      nodeColor = window.getComputedStyle(light).getPropertyValue('--banner-node-color');
      lineColor = window.getComputedStyle(light).getPropertyValue('--banner-line-color');
    } else {
      const dark = document.querySelector('.dark')!;
      bgColor = window.getComputedStyle(dark).getPropertyValue('--banner-bg-color')
      nodeColor = window.getComputedStyle(dark).getPropertyValue('--banner-node-color');
      lineColor = window.getComputedStyle(dark).getPropertyValue('--banner-line-color');
    }

    // Set up all canvas and node data:
    function setupCanvasData() {
      if (!canvas.current) return;
      width = window.innerWidth; // Set node canvas width
      let isMobile = width <= 768;
      nodeAmount = isMobile ? Math.floor(0.4 * nodeAmountMax) : nodeAmountMax;
      drawLineThreshold = isMobile ? 0.9 * drawLineThresholdMax : drawLineThresholdMax;
      speed = isMobile ? 0.7 * speedMultiplier : speedMultiplier;
      height = isMobile ? 0.75 * heightMax : heightMax;
      canvas.current.width = width;
      canvas.current.height = height;
      nodes = []; // Reset the nodes for resize event listener

      // Generate 'nodeAmount' number of nodes with random positions and push them to the nodes array:
      for (var i = 0; i < nodeAmount; i++) {
        var node = new Node(randomInt(0, width), randomInt(0, height), i);
        nodes.push(node);
      }
    }
  
    // Loop function to animate the canvas:
    function loop() {
      // Clear the canvas from nodes and lines:
      context.fillStyle = bgColor;
      context.fillRect(0, 0, width, height);
      // Move all nodes:
      for (let i = 0; i < nodes.length; i++) nodes[i].move();
      // Draw the lines again:
      drawLines();
      // Repeat the loop:
      requestAnimationFrame(loop);
    }

    // Draw the lines between the nodes:
    function drawLines() {
      // Get the rgb values for the color of the line:
      let rgbValues = lineColor.startsWith('rgb') ? rgbToRgbNums(lineColor) : hexToRgbNums(lineColor);

      for (let i = 0; i < nodes.length; i++) {
        if (colored) rgbValues = nodes[i].color.startsWith('rgb') ? rgbToRgbNums(nodes[i].color) : hexToRgbNums(nodes[i].color);

        // Get the origin point:
        let x1 = nodes[i].x;
        let y1 = nodes[i].y;

        // Get the destination point in a subloop that only loops the remaining nodes, to avoid duplicate lines:
        for (let j = i+1; j < nodes.length; j++) {
          // Get the destination point:
          let x2 = nodes[j].x;
          let y2 = nodes[j].y;

          // Calculate the distance between the origin and target points:
          let dist = distance(x1, x2, y1, y2);

          // If the distance is less than the threshold, draw the line:
          if (dist < drawLineThreshold) {
            let finalOpacity = 1 - (dist / drawLineThreshold);
            context.strokeStyle = `rgba(${rgbValues!.r}, ${rgbValues!.g}, ${rgbValues!.b}, ${finalOpacity})`;
            line(x1, y1, x2, y2);
          }
        }
      }
    }

    // Draw line given a set of two points (as x1, y1, x2 and y2):
    function line(x1: number, y1: number, x2: number, y2: number) {
      context.lineWidth = lineWidth;
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
    }

    // Draw circle given x, y and radius:
    function circle(x: number, y: number, radius: number) {
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.closePath();
    }

    setupCanvasData();
    requestAnimationFrame(loop); // Set up loop

    // Resize event listener:
    window.addEventListener('resize', setupCanvasData);
    return () => window.removeEventListener('resize', setupCanvasData);
  }, [resolvedTheme, colored])

  // Return random int from min to max inclusive:
  function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // Calculate the distance between two points:
  function distance(x1: number, x2: number, y1: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  // Convert from hex string to rgb number:
  function hexToRgbNums(hex: string) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }

  // Convert from rgb() string to rgb number:
  function rgbToRgbNums(rgb: string) {
    var result = /^rgb\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)$/i.exec(rgb);
    return result ? {
        r: parseInt(result[1]),
        g: parseInt(result[2]),
        b: parseInt(result[3])
    } : null;
  }

  return (
    <div className={`${props.className} w-full h-[345px] md:h-[460px] bg-[var(--banner-bg-color)]`} >
      {/* The following 2 spans are required to make the conditional
          `window.getComputedStyle()` on line 90 work properly: */}
      <span className='hidden light' />
      <span className='hidden dark' />
      <canvas className={props.className} ref={canvas} />
    </div>
  );
}