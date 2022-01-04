import { createMemo, For, useContext } from "solid-js";
import type { BookmarkEntryConfig } from './BookmarkEntry';
import type { BaseEntryConfig } from './Entry';
import { EntryTitle } from '../Entry';
import { ScreenLayerTypes } from "../../utils/constants";
import { ScreenLayerManagerContext } from "../ScreenLayerManager";
import type { ScreenLayerContextState } from "../ScreenLayerManager";

interface MiniEntryGroupConfig {
  readonly id: string,
  readonly type: string,
  name: string,
  items: (BaseEntryConfig | BookmarkEntryConfig)[]
}

export default function MiniEntryGroup(props) {
  const { showLayer } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState
  const config = createMemo(() => props.config as MiniEntryGroupConfig);
  function handleClick() {
    showLayer({
      type: ScreenLayerTypes.groupPopover,
      data: config()
    });
  }
  return (
    <div class="mini-entry-group-wrapper">
      <div class="mini-entry-group-container" onClick={handleClick}>
        <For each={config().items?.slice(0, 8)} children={<></>}>
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