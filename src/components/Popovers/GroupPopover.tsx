import { useContext, For, createMemo } from "solid-js";
import { Entry, AddEntryButton, MiniEntryGroupConfig } from "../Entry";
import PopoverTitle from './PopoverTitle';
import { ScreenLayerManagerContext } from "../ScreenLayerManager";
import type { ScreenLayerContextState } from "../ScreenLayerManager";
import { ScreenLayerTypes } from "../../utils/constants";

function GroupPopover() {
  const { currentScreenLayer, layers } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState;
  const entryGroup = createMemo(() => {
    if (currentScreenLayer().type === ScreenLayerTypes.groupPopover) {
      return currentScreenLayer().data as MiniEntryGroupConfig;
    } else if (layers()[ScreenLayerTypes.groupPopover]){
      // cache
      return layers()[ScreenLayerTypes.groupPopover].data as MiniEntryGroupConfig;
    }
  });
  return (
    <div class={`popover-container group-popover-container`}>
      <PopoverTitle name={entryGroup()?.name} />
      <For each={entryGroup()?.items} children={<></>}>
        {item => <Entry config={item} />}
      </For>
      <AddEntryButton parentId={entryGroup()?.id} />
    </div>
  );
}

export default GroupPopover;
