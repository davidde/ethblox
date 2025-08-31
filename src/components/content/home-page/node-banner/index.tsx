'use client';

import { useRef, useEffect, RefObject } from 'react';
import { useTheme } from 'next-themes';
import { setupCanvas } from './setup-canvas';
import { setupLoop } from './setup-loop';
import { NodeData } from './node';


export type CanvasData = {
  width: number;
  height: number;
  drawLineThreshold: number;
  lineWidth: number;
  nodesRef: RefObject<NodeData[]>;
}

export type ColorData = {
  bgColor: string;
  nodeColor: string;
  lineColor: string;
  linearGradientToColor: string;
  radialGradientTransparency: string;
}


export default function NodeBanner(props: { className?: string }) {
  const { resolvedTheme } = useTheme(); // theme is required to update NodeBanner colors on theme switch
  // Canvas ref is null before render:
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<NodeData[]>([]);

  useEffect(() => {
    // Canvas ref is null before render:
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d')!;

    // This conditional fixes the CSS vars update on theme switch;
    // when getting the CSS vars directly from document.documentElement,
    // it uses the CSS vars of the old theme that was switched away from!
    const themeElement = resolvedTheme === 'light' ? document.querySelector('.light')! : document.querySelector('.dark')!;
    const colorData: ColorData = {
      bgColor: window.getComputedStyle(themeElement).getPropertyValue('--banner-bg-color'),
      nodeColor: window.getComputedStyle(themeElement).getPropertyValue('--banner-node-color'),
      lineColor: window.getComputedStyle(themeElement).getPropertyValue('--banner-line-color'),
      linearGradientToColor: window.getComputedStyle(themeElement).getPropertyValue('--banner-linear-gradient-to-color'),
      // Alpha of bright center circle of radial gradient:
      radialGradientTransparency: resolvedTheme === 'light' ? '1' : '0.13',
    }

    // Set up canvas:
    let canvasData: CanvasData = setupCanvas(canvas, nodesRef, colorData.nodeColor);

    // Set up animation loop:
    let loop = setupLoop(context, canvasData, colorData);
    loop.start();

    // Resize event listener:
    function handleResize() {
      loop.stop();
      canvasData = setupCanvas(canvas, nodesRef, colorData.nodeColor);
      loop = setupLoop(context, canvasData, colorData);
      loop.start();
    }
    window.addEventListener('resize', handleResize);
    return () => {
      loop.stop();
      window.removeEventListener('resize', handleResize);
    }
  }, [resolvedTheme]);

  return (
    <div className={`${props.className} w-full bg-(--banner-bg-color)
                dark:shadow-xl/10 dark:shadow-[#3a3a3a]
                h-(--node-banner-height-px) -mt-(--content-y-margin)`}>
      {/* The following 2 spans are required to make the conditional
          `window.getComputedStyle()` on line 90 work properly: */}
      <span className='hidden light' />
      <span className='hidden dark' />
      <canvas ref={canvasRef} />
    </div>
  );
}