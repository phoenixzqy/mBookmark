import { For, createMemo, onCleanup, onMount, useContext } from "solid-js";
import { MiniEntryGroupType, ScreenLayerTypes } from '../../utils/constants';

import type { BaseEntryConfig } from './Entry';
import type { BookmarkEntryConfig } from './BookmarkEntry';
import { Draggable } from '../../utils/draggable';
import { EntryTitle } from '../Entry';
import type { ScreenLayerContextState } from "../ScreenLayerManager";
import { ScreenLayerManagerContext } from "../ScreenLayerManager";
import { offset } from "../../utils/helpers";

interface MiniEntryGroupConfig {
  readonly id: string,
  readonly type: string,
  name: string,
  items: (BaseEntryConfig | BookmarkEntryConfig)[]
}

export default function MiniEntryGroup(props) {
  let ref;
  const { showLayer } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState
  const config = createMemo(() => props.config as MiniEntryGroupConfig);
  function handleClick() {
    showLayer({
      type: ScreenLayerTypes.groupPopover,
      data: config()
    });
  }

  onMount(() => {
    Draggable.onDragStart(ref, (e, ele) => {
      ele.style.transform = "scale(1.2)";
      Draggable.setData({
        dragging: config(),
        dropOn: undefined,
        dropBefore: undefined,
        dropAfter: undefined
      });
    });
    Draggable.onDragOver(ref, (e, hoverEle, draggingEle) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("mini-entry-group-container")) {
        hoverEle.style.transform = "scale(1.1)";
        Draggable.setData({
          ...Draggable.getData(),
          dropOn: config(),
          dropBefore: undefined,
          dropAfter: undefined
        });
      } else {
        hoverEle.style.transform = "scale(1)";
        let data = {
          ...Draggable.getData(),
          dropOn: undefined,
          dropBefore: undefined,
          dropAfter: undefined
        };
        const draggingElePos = offset(draggingEle);
        const hoverElePos = offset(hoverEle);
        if (draggingElePos.left < hoverElePos.left) {
          data.dropBefore = config();
        } else {
          data.dropAfter = config();
        }
        Draggable.setData(data);
      }
    });
    Draggable.onDragLeave(ref, (e, hoverEle, draggingEle) => {
      hoverEle.style.transform = "scale(1)";
      Draggable.setData({
        ...Draggable.getData(),
        dropOn: undefined,
        dropBefore: undefined,
        dropAfter: undefined
      });
    });
  });
  onCleanup(() => {
    Draggable.clearDragStart(ref);
    Draggable.clearDragEnter(ref);
    Draggable.clearDragLeave(ref);
  });

  return (
    <div ref={ref} class="mini-entry-group-wrapper" is-draggable is-hoverable is-droppable entry-type={MiniEntryGroupType}>
      <div class="mini-entry-group-container" onClick={handleClick}>
        <For each={config().items?.slice(0, 9)} children={<></>}>
          {(item) => <div
            class="mini-entry-inner-app"
            style={{
              "background-image": item.icon ? `url("${item.icon}")` : undefined
            }}
          ></div>}
        </For>
      </div>
      <EntryTitle name={config().name} />
    </div>
  );
}

export type { MiniEntryGroupConfig };