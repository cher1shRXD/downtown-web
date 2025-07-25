export interface InteractionState {
  isDragging: React.RefObject<boolean>;
  previousMousePosition: React.RefObject<{ x: number; y: number }>;
  pinchDistance: React.RefObject<number>;
  initialPinchZoom: React.RefObject<number>;
}