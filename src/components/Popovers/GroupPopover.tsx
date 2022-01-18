import { AddEntryButton, BaseEntryConfig, BookmarkEntryConfig, Entry, MiniEntryGroupConfig } from "../Entry";
import { ArrowKeys, MiniEntryGroupType, ScreenLayerTypes, entrySize } from '../../utils/constants';
import { Coordinates, TouchSwipeDirections, elementSize, getElementSize, getTouchSwipeDirection } from '../../utils/helpers';
import { For, Show, createMemo, createSignal, onCleanup, onMount, useContext } from 'solid-js';

import { AppContext } from '../App';
import type { AppContextState } from '../App'
import { DragHoldArea } from "../Materialize/DragHoldArea";
import { Draggable } from "../../utils/draggable";
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
  let ref;
  const { currentScreenLayer, layers } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState;
  const { getUserHomepageConfig, moveEntryOutFromMoniGroup, moveEntryIntoMiniGroup, reOrderEntries } = useContext(AppContext) as AppContextState;
  const show = createMemo(() => currentScreenLayer().type === ScreenLayerTypes.groupPopover);
  const { defaultPage = 0 } = props;
  const [currentPage, setCurrentPage] = createSignal(defaultPage);
  const [capacity, setCapacity] = createSignal(0);
  const [entryGroupId, setEntryGroupId] = createSignal("");
  const [title, setTitle] = createSignal("");
  const [mounted, setMounted] = createSignal(false);
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
    if (items.length % capacity() === 0) {
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
  let touchStartTime: Date;
  function handleTouchStart(event: TouchEvent | MouseEvent) {
    if (!show()) return;
    touchStartTime = new Date();
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
    if (((touchEndTime as any) - (touchStartTime as any)) > 500) {
      return;
    }
    touchStartTime = null;
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
    ele.addEventListener("mousedown", handleTouchStart);
    ele.addEventListener("mouseup", handleTouchEnd);
    window.addEventListener("resize", handleResize);
    // drag n drop
    // only listen to drag n drop events in app container
    Draggable.onDragMove(ref);
    Draggable.onDragEnd(ref, (e, ele) => {
      ele.style.transform = "scale(1)";
      // handle drop here
      const data = Draggable.getData();
      if (data && data.dragging) {
        if (data.dragging.type !== MiniEntryGroupType && data.dropOn?.type === MiniEntryGroupType) {
          moveEntryIntoMiniGroup(data.dragging.id, data.dropOn.id);
        } else if (data.dragging.type !== MiniEntryGroupType && data.dropOn) {
          // will NOT allow to make sub-groups in group, so move the dragging entry in front of dragOn item
          reOrderEntries(data.dragging.id, "before", data.dropOn.id, entryGroupId());
        } else if (data.dragging.type !== MiniEntryGroupType && data.dropOn) {
          // EntryTypes
        } else if (data.dropBefore) {
          reOrderEntries(data.dragging.id, "before", data.dropBefore.id, entryGroupId());
        } else if (data.dropAfter) {
          reOrderEntries(data.dragging.id, "after", data.dropAfter.id, entryGroupId());
        } else {
          // move to the end
          reOrderEntries(data.dragging.id, "after", "last", entryGroupId());
        }
      }
    });
  });
  onCleanup(() => {
    try {
      const ele: HTMLElement = document.querySelector(".group-popover-wrapper");
      window.removeEventListener("keydown", handleKeyPress)
      ele.removeEventListener("touchstart", handleTouchStart);
      ele.removeEventListener("touchend", handleTouchEnd);
      ele.removeEventListener("mousedown", handleTouchStart);
      ele.removeEventListener("mouseup", handleTouchEnd);
      window.removeEventListener("resize", handleResize);
    } catch (e) {
      console.error(e)
    }
  });

  function getTabClass(index): string {
    let className = "group-popover-tab";
    if (index() === currentPage()) {
      return className + " group-popover-tab-active";
    } else return className;
  }
  return (
    <div ref={ref} class="popover-container group-popover-container">
      <PopoverTitle name={title()} groupId={entryGroupId()} />
      <div class="group-popover-tabs" style={{ display: show() ? "inline-block" : "none" }}>
        <For each={calculatedPages()} children={<></>}>
          {(item, index) => <span class={getTabClass(index)}></span>}
        </For>
      </div>
      <div class="group-popover-wrapper">

        <For each={calculatedPages()} children={<></>}>
          {(page, index) => (
            <div class="group-popover-page" style={calculatePosition(index)} >
              <DragHoldArea
                style={{
                  display: "blcok",
                  height: "100%",
                  width: "30px",
                  position: "absolute",
                  top: "0",
                  left: "0"
                }}
                callback={(e) => {
                  // the first normal page can't navigate to the left
                  if (index() === 0) return;
                  setCurrentPage(state => state - 1);
                }}
              ></DragHoldArea>
              <For each={page.items} children={<></>}>
                {item => <Entry config={item} />}
              </For>
              <Show when={page.items.length < capacity()} children={<></>}>
                <AddEntryButton parentId={entryGroupId()} />
              </Show>
              <DragHoldArea
                style={{
                  display: "blcok",
                  height: "100%",
                  width: "30px",
                  position: "absolute",
                  top: "0",
                  right: "0"
                }}
                callback={(e) => {
                  // the first normal page can't navigate to the left
                  if (index() === calculatedPages().length - 1) return;
                  setCurrentPage(state => state + 1);
                }}
              ></DragHoldArea>
            </div>
          )}
        </For>
      </div >
    </div >
  );
}

export default GroupPopover;
