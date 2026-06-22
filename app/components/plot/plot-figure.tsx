import { useEffect, useRef } from 'react';
import * as Plot from '@observablehq/plot';

type PlotFigureProps = {
  options: Plot.PlotOptions;
  className?: string;
}

export function PlotFigure({ options, className }: PlotFigureProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const plot = Plot.plot(options);
    node.replaceChildren(plot);
    return () => plot.remove();
  }, [options]);

  return <div ref={containerRef} className={className} />;
}