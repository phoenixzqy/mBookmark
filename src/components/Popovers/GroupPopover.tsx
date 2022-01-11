import { AddEntryButton, BaseEntryConfig, BookmarkEntryConfig, Entry, MiniEntryGroupConfig } from "../Entry";
import { ArrowKeys, MiniEntryGroupType, ScreenLayerTypes, entrySize } from '../../utils/constants';
import { Coordinates, TouchSwipeDirections, elementSize, getElementSize, getTouchSwipeDirection } from '../../utils/helpers';
import { For, Show, createMemo, createSignal, onCleanup, onMount, useContext } from 'solid-js';

import { AppContext } from '../App';
import type { AppContextState } from '../App'
import { NormalHomepageConfig } from "../Homepage";
import PopoverTitle from './PopoverTitle';
import type { ScreenLayerContextState } from "../ScreenLayerManager";
import { ScreenLayerManagerContext } from "../ScreenLayerManager";

interface GroupPopoverPage {
  items: (BookmarkEntryConfig | BaseEntryConfig)[]
}

function calculatePageCapacity(size: elementSize) {
  return Math.floor(size.x / entrySize.x) * Math.floor((size.y / entrySize.y));
}

function GroupPopover(props) {
  const { currentScreenLayer, layers } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState;
  const show = createMemo(() => currentScreenLayer().type === ScreenLayerTypes.groupPopover);
  const { getUserHomepageConfig } = useContext(AppContext) as AppContextState;
  const { defaultPage = 0 } = props;
  const [currentPage, setCurrentPage] = createSignal(defaultPage);
  const [capacity, setCapacity] = createSignal(0);
  const [entryGroupId, setEntryGroupId] = createSignal("");
  const [title, setTitle] = createSignal("");
  const calculatedPages = createMemo(() => {
    let id = "";
    if (currentScreenLayer().type === ScreenLayerTypes.groupPopover) {
      id = (currentScreenLayer().data as MiniEntryGroupConfig)?.id;
    } else if (layers()[ScreenLayerTypes.groupPopover]) {
      // cache
      id = (layers()[ScreenLayerTypes.groupPopover].data as MiniEntryGroupConfig)?.id;
    }
    if (id !== entryGroupId()) {
      setEntryGroupId(id);
      setCurrentPage(defaultPage);
    }
    if (!capacity()) return [];
    // get entryGroup date from global config. the data will be updated once user add/edit an entry
    const normalHpConfig = getUserHomepageConfig()[1] as NormalHomepageConfig;
    let items = [] as (BookmarkEntryConfig | BaseEntryConfig)[];
    let pages = [] as GroupPopoverPage[];
    if (normalHpConfig) {
      for (let item of normalHpConfig.items) {
        if (item.type === MiniEntryGroupType && item.id === id) {
          setTitle(item.name);
          items = item.items;
          break;
        }
      }
    }
    for (let i = 0; i < items.length; i += capacity()) {
      pages.push({ items: items.slice(i, i + capacity()) });
    }
    if (items.length === capacity()) {
      // add an emptry page for add button
      pages.push({ items: [] });
    }
    return pages;
  });
  function calculatePosition(index): Object {
    return {
      left: `${(index() - currentPage()) * 100}%`
    }
  }
  function handleKeyPress(event: KeyboardEvent): void {
    if (!show()) return;
    const { key } = event;
    if (!key) return;
    if (key === ArrowKeys.Left && currentPage() > 0) {
      setCurrentPage(state => state - 1);
    } else if (key === ArrowKeys.Right && currentPage() < (calculatedPages().length - 1)) {
      setCurrentPage(state => state + 1);
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
    if (direction === TouchSwipeDirections.right && currentPage() > 0) {
      setCurrentPage(state => state - 1);
    } else if (direction === TouchSwipeDirections.left && currentPage() < (calculatedPages().length - 1)) {
      setCurrentPage(state => state + 1);
    } else return;
  }
  function handleResize() {
    const newCapacity = calculatePageCapacity(getElementSize(document.querySelector(".group-popover-wrapper")));
    if (newCapacity !== capacity()) {
      setCapacity(newCapacity);
      setCurrentPage(defaultPage)
    }
  }

  onMount(() => {
    setCapacity(calculatePageCapacity(getElementSize(document.querySelector(".group-popover-wrapper"))));
    const ele: HTMLElement = document.querySelector(".group-popover-wrapper");
    window.addEventListener("keydown", handleKeyPress);
    ele.addEventListener("touchstart", handleTouchStart);
    ele.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("resize", handleResize);
  });
  onCleanup(() => {
    try {
      const ele: HTMLElement = document.querySelector(".group-popover-wrapper");
      window.removeEventListener("keydown", handleKeyPress)
      ele.removeEventListener("touchstart", handleTouchStart);
      ele.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
    } catch (e) {
      console.error(e)
    }
  });
  return (
    <div class="popover-container group-popover-container">
      <PopoverTitle name={title()} />
      <div class="group-popover-wrapper">
        <For each={calculatedPages()} children={<></>}>
          {(page, index) => (
            <div class="group-popover-page" style={calculatePosition(index)} >
              <For each={page.items} children={<></>}>
                {item => <Entry config={item} />}
              </For>
              <Show when={page.items.length < capacity()} children={<></>}>
                <AddEntryButton parentId={entryGroupId()} />
              </Show>
            </div>
          )}
        </For>
      </div >
    </div >
  );
}

export default GroupPopover;
