interface IDraggable {
  key?: number;
  isDragging: boolean;
  draggable: boolean;
  startDrag: () => void;
  stopDrag: (cancelled: boolean) => void;
  drag: (position: { x: number, y: number, z: number }) => void;
}

export default IDraggable;
