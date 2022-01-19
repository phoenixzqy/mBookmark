import { AddEntryButton, Entry, MiniEntryGroup } from '../Entry';
import { AppContext, AppContextState } from '../mBookmark';
import type { BaseEntryConfig, BookmarkEntryConfig, MiniEntryGroupConfig } from '../Entry';
import { EntryTypes, MiniEntryGroupType } from '../../utils/constants';
import { For, Show, createMemo, onMount, useContext } from 'solid-js';

import { BaseHomepageConfig } from './Homepage';
import { DragHoldArea } from '../Materialize/DragHoldArea';
import { Draggable } from '../../utils/draggable';

interface NormalHomepageConfig extends BaseHomepageConfig {
  items: (MiniEntryGroupConfig | BaseEntryConfig | BookmarkEntryConfig)[]
}
export default function NormalHomepage(props) {
  let ref;
  const { pageNumber, pageCount, setCurrentHomepage } = props;
  const { createMiniGroupBy2Entry, moveEntryIntoMiniGroup, reOrderEntries } = useContext(AppContext) as AppContextState;
  const config = createMemo(() => props.config as NormalHomepageConfig);
  const capacity = createMemo(() => {
    return props.capacity as number
  });

  onMount(() => {
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
          // EntryTypes
          createMiniGroupBy2Entry(data.dragging.id, data.dropOn.id);
        } else if (data.dragging.type === MiniEntryGroupType && data.dropOn) {
          // no sub group allowed, so just re order them
          reOrderEntries(data.dragging.id, "before", data.dropOn.id);
        } else if (data.dropBefore) {
          reOrderEntries(data.dragging.id, "before", data.dropBefore.id);
        } else if (data.dropAfter) {
          reOrderEntries(data.dragging.id, "after", data.dropAfter.id);
        } else {
          // move to the end
          reOrderEntries(data.dragging.id, "after", "last");
        }
      }
    });
  });
  return (
    <div class="homepage-app-container" ref={ref}>
      <DragHoldArea
        style={{
          display: "blcok",
          height: "100%",
          width: "20px",
          position: "absolute",
          top: "0",
          left: "0"
        }}
        callback={(e) => {
          // the first normal page can't navigate to the left
          if (pageNumber === 1) return;
          setCurrentHomepage(state => state - 1);
        }}
      ></DragHoldArea>
      <For each={config().items} children={<></>}>
        {(item) => {
          if (item.type === MiniEntryGroupType) return <MiniEntryGroup config={item} />;
          if (Object.values(EntryTypes).includes(item.type)) return <Entry config={item} />;
          return null;
        }}
      </For>
      <Show when={(config()?.items?.length || 0) < capacity()} children={<></>}>
        <AddEntryButton />
      </Show>

      <DragHoldArea
        style={{
          display: "blcok",
          height: "100%",
          width: "20px",
          position: "absolute",
          top: "0",
          right: "0"
        }}
        callback={(e) => {
          // the first normal page can't navigate to the left
          if (pageNumber === pageCount - 2) return;
          setCurrentHomepage(state => state + 1);
        }}
      ></DragHoldArea>
    </div>
  );
}

export type { NormalHomepageConfig };
