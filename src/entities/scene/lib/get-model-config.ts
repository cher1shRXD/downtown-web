export const getModelConfig = (tileType: number) => {
  switch (tileType) {
    case 1:
      return {
        modelKey: 'book1',
        scale: { x: 3, y: 5, z: 3 },
        rotation: { x: -300, y: 50, z: -10 },
        positionY: 5
      };
    case 2:
      return {
        modelKey: 'book3',
        scale: { x: 15, y: 15, z: 15 },
        rotation: { x: 0, y: 0, z: 0 },
        positionY: 1.2
      };
    case 3:
      return {
        modelKey: 'book4',
        scale: { x: 7, y: 10, z: 7 },
        rotation: { x: 0, y: 0, z: 0 },
        positionY: 3
      };
    case 4:
      return {
        modelKey: 'bookMany',
        scale: { x: 40, y: 40, z: 40 },
        rotation: { x: 0, y: Math.random() * Math.PI, z: 0 },
        positionY: 0
      };
    case 7:
      return {
        modelKey: 'house',
        scale: { x: 20, y: 20, z: 20 },
        rotation: { x: 0, y: Math.PI, z: 0 },
        positionY: 0
      }
    default:
      return null;
  }
};
