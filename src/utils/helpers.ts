export interface Coordinates {
    x: number;
    y: number;
}
export enum TouchSwipeDirections {
    up,
    down,
    left,
    right
}
export function getTouchSwipeDirection(startCoordinates: Coordinates, endCoordinates: Coordinates): TouchSwipeDirections | boolean {
    if (!startCoordinates || !endCoordinates) return false;
    if (endCoordinates.x - startCoordinates.x === 0 && endCoordinates.y - startCoordinates.y === 0) return false;
    const xDiff = endCoordinates.x - startCoordinates.x;
    const yDiff = endCoordinates.y - startCoordinates.y;
    if (Math.abs(xDiff) > Math.abs(yDiff)) {
        // horizontal swipe
        if (xDiff > 0) return TouchSwipeDirections.right;
        else return TouchSwipeDirections.left;
    } else {
        // virtical swipe
        if (yDiff > 0) return TouchSwipeDirections.down;
        else return TouchSwipeDirections.up;
    }
}