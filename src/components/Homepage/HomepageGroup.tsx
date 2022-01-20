import { ArrowKeys, HomepageTypes, entrySize } from "../../utils/constants";
import { Coordinates, TouchSwipeDirections, elementSize, getElementSize, getTouchSwipeDirection } from '../../utils/helpers';
import { For, Show, createMemo, createSignal, onCleanup, onMount, useContext } from "solid-js";

import type { BaseHomepageConfig } from './Homepage';
import { Dock } from "../Dock";
import Homepage from './Homepage';
import { NormalHomepageConfig } from '.';
import type { ScreenLayerContextState } from "../ScreenLayerManager";
import { ScreenLayerManagerContext } from "../ScreenLayerManager";
import { ScreenLayerTypes } from "../../utils/constants";

function calculateScreenCapacity(size: elementSize) {
  return Math.floor(size.x / entrySize.x) * Math.floor((size.y / entrySize.y) - 1);
}

export default function HomepageGroup(props) {
  const { defaultHomepage = 1 } = props;
  const { currentScreenLayer, register, showLayer } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState
  const show = createMemo(() => currentScreenLayer().type === ScreenLayerTypes.homepage);
  const [currentHomepage, setCurrentHomepage] = createSignal(defaultHomepage);
  const [capacity, setCapacity] = createSignal(0);
  const calculatedHomepages = createMemo(() => {
    let config = props.config as BaseHomepageConfig[];
    if (!capacity()) return config;
    let normalPageConfig = config[defaultHomepage] as NormalHomepageConfig;
    // 1. calculate the capacity based on app screen size
    // 2. split "normal" page as needed
    const normalPages = [];
    for (let i = 0; i < normalPageConfig.items.length; i += capacity()) {
      normalPages.push({
        type: HomepageTypes.normal,
        items: normalPageConfig.items.slice(i, i + capacity())
      });
    }
    if (normalPageConfig.items.length % capacity() === 0) {
      // add an emptry page for add button
      normalPages.push({
        type: HomepageTypes.normal,
        items: []
      });
    }
    return [
      config[0],
      ...normalPages,
      config[2]
    ];
  });
  function calculatePosition(index): Object {
    return {
      left: `${(index() - currentHomepage()) * 100}%`
    }
  }
  function backToHomepage() {
    setCurrentHomepage(defaultHomepage);
  }
  function getTabClass(index): string {
    let className = "homepage-group-tab";
    if (index() === currentHomepage()) {
      return className + " homepage-group-tab-active";
    } else return className;
  }

  function handleKeyPress(event: KeyboardEvent): void {
    if (!show()) return;
    const { key } = event;
    if (!key) return;
    if (key === ArrowKeys.Left && currentHomepage() > 0) {
      setCurrentHomepage(state => state - 1);
    } else if (key === ArrowKeys.Right && currentHomepage() < (calculatedHomepages().length - 1)) {
      setCurrentHomepage(state => state + 1);
    } else if (key === ArrowKeys.Down) {
      showLayer({
        type: ScreenLayerTypes.searchPopover
      })
    }
  }
  let touchStartCoordinates: Coordinates = {
    x: 0,
    y: 0
  }
  let touchStartTime: Date;
  function handleTouchStart(event: TouchEvent | MouseEvent) {
    if (!show()) return;
    touchStartTime = new Date();
    // handle both touch and click events
    if ((event as TouchEvent).changedTouches) {
      touchStartCoordinates = {
        x: (event as TouchEvent).changedTouches[0].screenX,
        y: (event as TouchEvent).changedTouches[0].screenY,
      }
    } else {
      touchStartCoordinates = {
        x: (event as MouseEvent).screenX,
        y: (event as MouseEvent).screenY,
      }
    }
  }
  function handleTouchEnd(event: TouchEvent | MouseEvent) {
    if (!show()) return;
    let touchEndTime = new Date();
    // if the event finishes longer than .5s, treat it as "hold" event.
    if (((touchEndTime as any) - (touchStartTime as any)) > 500) {
      return;
    }
    touchStartTime = null;
    // handle both touch and click events
    let touchEndCoordinates = { x: -1, y: -1 }
    if ((event as TouchEvent).changedTouches) {
      touchEndCoordinates = {
        x: (event as TouchEvent).changedTouches[0].screenX,
        y: (event as TouchEvent).changedTouches[0].screenY,
      }
    } else {
      touchEndCoordinates = {
        x: (event as MouseEvent).screenX,
        y: (event as MouseEvent).screenY,
      }
    }
    const direction = getTouchSwipeDirection(touchStartCoordinates, touchEndCoordinates);
    if (!direction) return;
    if (direction === TouchSwipeDirections.right && currentHomepage() > 0) {
      setCurrentHomepage(state => state - 1);
    } else if (direction === TouchSwipeDirections.left && currentHomepage() < (calculatedHomepages().length - 1)) {
      setCurrentHomepage(state => state + 1);
    } else if (direction === TouchSwipeDirections.down) {
      // show searchPopover page
      showLayer({ type: ScreenLayerTypes.searchPopover });
    }
  }
  function handleResize() {
    const newCapacity = calculateScreenCapacity(getElementSize(document.getElementById("app")));
    if (newCapacity !== capacity()) {
      setCapacity(newCapacity);
      setCurrentHomepage(defaultHomepage)
    }
  }
  let ref;
  onMount(() => {
    register({
      type: ScreenLayerTypes.homepage,
      ref
    });
    const ele: HTMLElement = document.querySelector(".homepage-group");
    window.addEventListener("keydown", handleKeyPress);
    ele.addEventListener("touchstart", handleTouchStart);
    ele.addEventListener("touchend", handleTouchEnd);
    ele.addEventListener("mousedown", handleTouchStart);
    ele.addEventListener("mouseup", handleTouchEnd);
    window.addEventListener("resize", handleResize);
    setCapacity(calculateScreenCapacity(getElementSize(document.getElementById("app"))))
  });
  onCleanup(() => {
    try {
      const ele: HTMLElement = document.querySelector(".homepage-group");
      window.removeEventListener("keydown", handleKeyPress)
      ele.removeEventListener("touchstart", handleTouchStart);
      ele.removeEventListener("touchend", handleTouchEnd);
      ele.removeEventListener("mousedown", handleTouchStart);
      ele.removeEventListener("mouseup", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
    } catch (e) {
      console.error(e);
    }
  });
  return (
    <div ref={ref} class="homepage-group">
      <For each={calculatedHomepages()} children={<></>}>
        {(item, index) => <div class="homepage-group-item" style={calculatePosition(index)}>
          <Homepage config={item} capacity={capacity()} pageNumber={index()} pageCount={calculatedHomepages().length} setCurrentHomepage={setCurrentHomepage} backToHomepage={backToHomepage} />
        </div>}
      </For>
      <Show when={currentHomepage() > 0} children={<></>}>
        <div class="homepage-group-tabs" style={{ display: show() ? "inline-block" : "none" }}>
          <For each={calculatedHomepages()} children={<></>}>
            {(item, index) => <span class={getTabClass(index)}></span>}
          </For>
        </div>
        <Dock></Dock>
      </Show>
    </div>
  );
}