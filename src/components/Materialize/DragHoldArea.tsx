import { createSignal, onMount } from 'solid-js';

import { Draggable } from '../../utils/draggable';

/**
 * This is an area which is used to detect user drag and hold event
 * @param props 
 * @returns 
 */
export function DragHoldArea(props) {
  let ref;
  const {
    style,
    callback,
    holdDuration = 500, // hold event duration, drigger callback when user hold longer than this 
  } = props;
  const [initialized, setInitialized] = createSignal(false);
  let tid;
  let lastPos = [-1, -1];
  onMount(() => {
    if (!initialized()) {
      setInitialized(true);
      Draggable.onDragMove(ref, (e, ele) => {
        lastPos = [e.clientX, e.clientY];
        if (tid) clearInterval(tid);
        tid = setTimeout(() => {
          // fire callback if user hold in current position area
          if (e.clientX === lastPos[0], e.clientY === lastPos[1]) {
            callback(e);
          }
        }, holdDuration);
      });
      Draggable.onDragLeave(ref, () => {
        if (tid) clearInterval(tid);
      })
    }
  })

  return <div ref={ref} style={style}></div>
}