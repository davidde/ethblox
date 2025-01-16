'use client';

import { useRef, useEffect } from 'react';


type Props = {
  children: React.ReactNode,
  className: string,
}

// Settings:
const colored = false; // gives nodes random colors when true, nodeColor when false
const bgColor = "#15172e";
const nodeColor = "#3f426a"; // Only when colored is false!
const nodeSize = 3; // node radius in pixels
const lineWidth = 2; // node connection line width in pixels
const speed = 0.2; // speed multiplier
const nodeAmount = 100; // node amount, the more the slower
const drawLineThreshold = 100; // distance threshold for drawing the lines between nodes; higher = more lines = slower
const height = 300; // node canvas height

export default function NodeBanner(props: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  // node position array for drawing the lines:
  let nodePositionArray : [number, number, string][] = []; // indexed by node id, each id containing a sub-array of x, y and color.
  let t = 0; // counter variable
  let nodes: Node[] = []; // node array
  let width: number;

  // node constructor function
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

      // if the node id is even, start moving them in the opposite direction
      if (isEven(id)) {
        this.speedX = randomInt(1, 100)/100 * speed;
        this.speedY = randomInt(1, 100)/100 * speed;
      } else {
        this.speedX = randomInt(1, 100)/100 * speed * -1;
        this.speedY = randomInt(1, 100)/100 * speed * -1;
      }

      this.size = nodeSize;

      // color array for random color setting:
      const colors = ['#4f91f9', '#a7f94f', '#f94f4f', '#f9f74f', '#8930ff', '#fc4edf', '#ff9c51'];
      // set random color from array:
      this.color = colored ? colors[Math.floor(Math.random() * colors.length)] : nodeColor;

      this.move = function() {
        this.y += this.speedY;
        this.x += this.speedX;

        // make them bounce
        if (this.y < 1 || this.y > height - nodeSize * 2) {
          this.speedY = - this.speedY;
        }
        if (this.x < 1 || this.x > width - nodeSize * 2) {
          this.speedX = - this.speedX;
        }

        // push the position and color to the array for drawing the lines
        nodePositionArray[this.id] = [this.x, this.y, this.color];
      };

      // draw the nodes
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

    width = window.innerWidth; // node canvas width
    canvas.width = width;
    canvas.height = height;
    clearCanvas(context);

    // generate x random of nodes with random position and push them to the array
    for (var i = 0; i < nodeAmount; i++) {
      var node = new Node(randomInt(0, width), randomInt(0, height), i, context);
      nodes.push(node);
    }

    // set them nodes up! (for initializing the nodePositionArray)
    for (var i = 0; i < nodes.length; i++){
      nodes[i].move();
      nodes[i].draw();
    }

    // run the loop
    loop(context);

    // resize event listener
    let onResize = () => {
      canvas.width = width;
      canvas.height = height;

      clearCanvas(context);

      // reset the nodes
      nodes = [];

      // generate nodes again
      for (let i = 0; i < nodeAmount; i++) {
        var node = new Node(randomInt(0, width), randomInt(0, height), i, context);
        nodes.push(node);
      }

      // set them up
      for (var i = 0; i < nodes.length; i++) {
        nodes[i].move();
        nodes[i].draw();
      }
    }
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, [])

  // Return random int from min to max inclusive:
  function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  function clearCanvas(context: CanvasRenderingContext2D) {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);
  }

  function drawLines(context: CanvasRenderingContext2D) {
    for (var i = 0; i < nodePositionArray.length - 1; i++) {

      // get the origin point
      var x1 = nodePositionArray[i][0];
      var y1 = nodePositionArray[i][1];

      // this sub-loop is made to avoid drawing the nodes twice, which leads to consume more cpu and spoils the opacity effect
      for (var j = 0; j < nodePositionArray.length - (i + 1); j++){

        // get the destination point
        var x2 = nodePositionArray[j + i + 1][0];
        var y2 = nodePositionArray[j + i + 1][1];

        // calculate distance between the origin and target points
        var dist = distance(x1, x2, y1, y2);

        // if distance is greater than the threshold, draw the lines
        if (dist < drawLineThreshold) {
          var finalOpacity = map_range(dist, 0, drawLineThreshold, 1, 0);
          var rgbValues = hexToRgb(nodePositionArray[i][2]);
          var color = 'rgba(' + rgbValues!.r + ',' + rgbValues!.g + ',' + rgbValues!.b + ',' + finalOpacity + ')';

          context.strokeStyle = color;
          line(x1, y1, x2, y2, context);
        }
      }
    }
  }

  // loop function
  function loop(context: CanvasRenderingContext2D) {
    // reset canvas
    clearCanvas(context);

    // draw the lines
    drawLines(context);

    // move each node and draw it
    for (var i = 0; i < nodes.length; i++){
      nodes[i].move();
      nodes[i].draw();
    }

    // repeat loop
    requestAnimationFrame(() => loop(context));

    // increase counter
    t++;
  }

  // circle function (draws circle given x, y and radius)
  function circle(x: number, y: number, radius: number, context: CanvasRenderingContext2D) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI);
    context.closePath();
  }

  // line function (draws line given a set of two points(as x1, y1, x2, y2))
  function line(x1: number, y1: number, x2: number, y2: number, context: CanvasRenderingContext2D){
    context.lineWidth = lineWidth;
    context.beginPath();
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
  }

  // calculate the distance between two points
  function distance(x1: number, x2: number, y1: number, y2: number){
    var xDist = x2 - x1;
    var yDist = y2 - y1;
    return Math.sqrt(xDist * xDist + yDist * yDist);
  }

  // range a numbers given a value and two ranges
  function map_range(value: number, low1: number, high1: number, low2: number, high2: number) {
      return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
  }

  // check if n is even
  function isEven(n: number) {
    return !(n % 2);
  }

  //convert from hex to rgb
  function hexToRgb(hex: string) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
      } : null;
  }

  return (
    <canvas className={props.className} ref={ref} >
      {props.children}
    </canvas>
  );
}