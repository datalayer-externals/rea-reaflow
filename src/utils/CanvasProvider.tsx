import { ElkRoot, useLayout } from '../layout/useLayout';
import React, { createContext, RefObject, useContext } from 'react';
import { NodeData, PortData } from '../types';
import { EdgeDragResult, useEdgeDrag } from './useEdgeDrag';
import { useZoom } from './useZoom';

export interface CanvasProviderValue extends EdgeDragResult {
  selections?: string[];
  readonly?: boolean;
  layout?: ElkRoot;
  xy: [number, number];
  scrollXY: [number, number];
  containerRef: RefObject<HTMLDivElement>;
  svgRef: RefObject<SVGSVGElement>;
  canvasHeight: number;
  canvasWidth: number;
  containerHeight: number;
  containerWidth: number;
  zoom: number;
  pannable: boolean;
  setZoom: (factor: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  centerCanvas: () => void;
  fitCanvas: () => void;
}

export const CanvasContext = createContext<CanvasProviderValue>({} as any);

export interface CanvasProviderProps {
  onNodeLink?: (from: NodeData, to: NodeData, port?: PortData) => void;
  onNodeLinkCheck?: (
    from: NodeData,
    to: NodeData,
    port?: PortData
  ) => undefined | boolean;
}

export const CanvasProvider = ({
  selections,
  onNodeLink,
  readonly,
  children,
  nodes,
  edges,
  maxHeight,
  fit,
  maxWidth,
  direction,
  layoutOptions,
  pannable,
  center,
  zoomable,
  zoom,
  minZoom,
  maxZoom,
  onNodeLinkCheck,
  onLayoutChange,
  onZoomChange
}) => {
  const zoomProps = useZoom({
    zoom,
    minZoom,
    maxZoom,
    disabled: !zoomable,
    onZoomChange
  });

  const layoutProps = useLayout({
    nodes,
    edges,
    maxHeight,
    maxWidth,
    direction,
    pannable,
    center,
    fit,
    layoutOptions,
    zoom: zoomProps.zoom,
    setZoom: zoomProps.setZoom,
    onLayoutChange
  });

  const dragProps = useEdgeDrag({
    onNodeLink,
    onNodeLinkCheck
  });

  return (
    <CanvasContext.Provider
      value={{
        selections,
        readonly,
        pannable,
        ...layoutProps,
        ...zoomProps,
        ...dragProps
      }}
    >
      {children}
    </CanvasContext.Provider>
  );
};

export const useCanvas = () => {
  const context = useContext(CanvasContext);

  if (context === undefined) {
    throw new Error(
      '`useCanvas` hook must be used within a `CanvasContext` component'
    );
  }

  return context;
};
