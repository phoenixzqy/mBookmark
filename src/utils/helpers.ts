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
  if (Math.abs(xDiff) < 50 && Math.abs(yDiff) < 50) return false;
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

export function generateUUID(): string {
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16;//random number between 0 and 16
    if (d > 0) {//Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {//Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

export function generateElementId(): string {
  return generateUUID().split("-")[0];
}

export interface elementSize {
  x: number,
  y: number
}

export function getElementSize(ele: HTMLElement): elementSize {
  return {
    x: ele.offsetWidth,
    y: ele.offsetHeight
  }
}
export function offset(el: HTMLElement) {
  var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}

export function debounce(fnToDebounce, delay) {
  let scheduleId
  const debounced = (...args) => {
    const context = this
    const deferredCall = fnToDebounce.apply(context, args)
    if (scheduleId) {
      clearTimeout(scheduleId)
    }
    scheduleId = setTimeout(deferredCall, delay)
  }
  return debounced
}
export function throttle(fn, delay) {
  let scheduledId
  return function throttled() {
    const context = this
    const args = arguments
    const throttledCall = fn.apply(context, args)
    if (scheduledId) return
    scheduledId = setTimeout(() => {
      throttledCall()
      clearTimeout(scheduledId)
    }, delay)
  }
}
