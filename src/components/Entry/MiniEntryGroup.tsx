import { For, createMemo, useContext } from "solid-js";

import type { BaseEntryConfig } from './Entry';
import type { BookmarkEntryConfig } from './BookmarkEntry';
import { EntryTitle } from '../Entry';
import type { ScreenLayerContextState } from "../ScreenLayerManager";
import { ScreenLayerManagerContext } from "../ScreenLayerManager";
import { ScreenLayerTypes } from "../../utils/constants";

interface MiniEntryGroupConfig {
  readonly id: string,
  readonly type: string,
  name: string,
  items: (BaseEntryConfig | BookmarkEntryConfig)[]
}

export default function MiniEntryGroup(props) {
  const { isDraggable = false } = props;
  const { showLayer } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState
  const config = createMemo(() => props.config as MiniEntryGroupConfig);
  function handleClick() {
    showLayer({
      type: ScreenLayerTypes.groupPopover,
      data: config()
    });
  }
  return (
    <div class="mini-entry-group-wrapper" is-draggable={isDraggable ? true : false}>
      <div class="mini-entry-group-container" onClick={handleClick}>
        <For each={config().items?.slice(0, 9)} children={<></>}>
          {(item) => <div
            class="mini-entry-inner-app"
            style={{
              "background-image": `url("${item.icon}")`
            }}
          ></div>}
        </For>
      </div>
      <EntryTitle name={config().name} />
    </div>
  );
}

export type { MiniEntryGroupConfig };