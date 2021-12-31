import { createSignal, useContext, For, onMount, onCleanup } from "solid-js";
import { PopoverGroupContext, PopoverContextState } from '../App';
import { ArrowKeys } from "../../utils/constants";
import { getTouchSwipeDirection, TouchSwipeDirections, Coordinates} from "../../utils/helpers";
import type { BaseScreenConfig } from './Screen';
import Screen from './Screen';

export default function ScreenGroup(props) {
  const { defaultScreen = 1 } = props;
  const { isPopoverShow } = useContext(PopoverGroupContext) as PopoverContextState;
  const [currentScreen, setCurrentScreen] = createSignal(defaultScreen);
  const [screens] = createSignal(props.config as BaseScreenConfig[])
  function calculatePosition(index): Object {
    return {
      left: `${(index() - currentScreen()) * 100}%`
    }
  }
  
  function getTabClass(index): string {
    let className = "screen-group-tab";
    if (index() === currentScreen()) {
      return className + " screen-group-tab-active";
    } else return className;
  }
  
  function handleKeyPress(event:KeyboardEvent): void {
    if (isPopoverShow()) return;
    const { key } = event;
    if (!key) return;
    if (key === ArrowKeys.Left && currentScreen() > 0) {
      setCurrentScreen(state => state - 1);
    } else if (key === ArrowKeys.Right && currentScreen() < (screens().length - 1)) {
      setCurrentScreen(state => state + 1);
    }
  }
  let touchStartCoordinates: Coordinates = {
    x: 0,
    y: 0
  }
  function handleTouchStart(event: TouchEvent) {
    if (isPopoverShow()) return;
    touchStartCoordinates = {
      x: event.changedTouches[0].screenX,
      y: event.changedTouches[0].screenY,
    }
  }
  function handleTouchEnd(event: TouchEvent) {
    if (isPopoverShow()) return;
    let touchEndCoordinates: Coordinates = {
      x: event.changedTouches[0].screenX,
      y: event.changedTouches[0].screenY,
    }
    const direction = getTouchSwipeDirection(touchStartCoordinates, touchEndCoordinates);
    if (!direction) return;
    if (direction === TouchSwipeDirections.right && currentScreen() > 0) {
      setCurrentScreen(state => state - 1);
   } else if (direction === TouchSwipeDirections.left && currentScreen() < (screens().length - 1)) {
      setCurrentScreen(state => state + 1);
   } else return;
  }
  onMount(() => {
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
    <div class="screen-group">
      <div class="screen-group-tabs" style={{ display: isPopoverShow() ? "none": "inline-block"}}>
        <For each={screens()}>
          {(item, index) => <span class={getTabClass(index)}></span>}
        </For>
      </div>
      <For each={screens()}>
        {(item, index) => <div class="screen-group-item" style={calculatePosition(index)}>
            <Screen config={item}/>
          </div>}
      </For>
    </div>
  );
}