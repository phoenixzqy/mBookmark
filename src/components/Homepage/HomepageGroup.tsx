import { createSignal, useContext, For, onMount, onCleanup, createMemo } from "solid-js";
import { ArrowKeys } from "../../utils/constants";
import { getTouchSwipeDirection, TouchSwipeDirections, Coordinates} from "../../utils/helpers";
import type { BaseHomepageConfig } from './Homepage';
import Homepage from './Homepage';
import { ScreenLayerTypes } from "../../utils/constants";
import { ScreenLayerManagerContext } from "../ScreenLayerManager";
import type { ScreenLayerContextState } from "../ScreenLayerManager";

export default function HomepageGroup(props) {
  const { defaultHomepage = 1 } = props;
  const { currentScreenLayer, register } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState
  const show = createMemo(() => currentScreenLayer().type === ScreenLayerTypes.homepage); 
  const [currentHomepage, setCurrentHomepage] = createSignal(defaultHomepage);
  const homepages = createMemo(() => props.config as BaseHomepageConfig[])
  function calculatePosition(index): Object {
    return {
      left: `${(index() - currentHomepage()) * 100}%`
    }
  }
  
  function getTabClass(index): string {
    let className = "homepage-group-tab";
    if (index() === currentHomepage()) {
      return className + " homepage-group-tab-active";
    } else return className;
  }
  
  function handleKeyPress(event:KeyboardEvent): void {
    if (!show()) return;
    const { key } = event;
    if (!key) return;
    if (key === ArrowKeys.Left && currentHomepage() > 0) {
      setCurrentHomepage(state => state - 1);
    } else if (key === ArrowKeys.Right && currentHomepage() < (homepages().length - 1)) {
      setCurrentHomepage(state => state + 1);
    }
  }
  let touchStartCoordinates: Coordinates = {
    x: 0,
    y: 0
  }
  function handleTouchStart(event: TouchEvent) {
    if (!show()) return;
    touchStartCoordinates = {
      x: event.changedTouches[0].screenX,
      y: event.changedTouches[0].screenY,
    }
  }
  function handleTouchEnd(event: TouchEvent) {
    if (!show()) return;
    let touchEndCoordinates: Coordinates = {
      x: event.changedTouches[0].screenX,
      y: event.changedTouches[0].screenY,
    }
    const direction = getTouchSwipeDirection(touchStartCoordinates, touchEndCoordinates);
    if (!direction) return;
    if (direction === TouchSwipeDirections.right && currentHomepage() > 0) {
      setCurrentHomepage(state => state - 1);
   } else if (direction === TouchSwipeDirections.left && currentHomepage() < (homepages().length - 1)) {
      setCurrentHomepage(state => state + 1);
   } else return;
  }

  let ref;
  onMount(() => {
    register({
      type: ScreenLayerTypes.homepage,
      ref
    });
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("touchstart", handleTouchStart);
    window.addEventListener("touchend", handleTouchEnd);
  });
  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyPress)
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchend", handleTouchEnd);
  });
  return (
    <div ref={ref} class="homepage-group">
      <div class="homepage-group-tabs" style={{ display: show() ? "inline-block" : "none"}}>
        <For each={homepages()} children={<></>}>
          {(item, index) => <span class={getTabClass(index)}></span>}
        </For>
      </div>
      <For each={homepages()} children={<></>}>
        {(item, index) => <div class="homepage-group-item" style={calculatePosition(index)}>
            <Homepage config={item}/>
          </div>}
      </For>
    </div>
  );
}