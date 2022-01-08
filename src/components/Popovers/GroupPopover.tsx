import { AddEntryButton, Entry, MiniEntryGroupConfig } from "../Entry";
import { For, createMemo, useContext } from "solid-js";
import { MiniEntryGroupType, ScreenLayerTypes } from '../../utils/constants';

import { AppContext } from '../App';
import type { AppContextState } from '../App'
import { NormalHomepageConfig } from "../Homepage";
import PopoverTitle from './PopoverTitle';
import type { ScreenLayerContextState } from "../ScreenLayerManager";
import { ScreenLayerManagerContext } from "../ScreenLayerManager";

function GroupPopover() {
  const { currentScreenLayer, layers } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState;
  const { getUserHomepageConfig } = useContext(AppContext) as AppContextState;
  const entryGroup = createMemo(() => {
    let entryGroupId = "";
    if (currentScreenLayer().type === ScreenLayerTypes.groupPopover) {
      entryGroupId = (currentScreenLayer().data as MiniEntryGroupConfig)?.id;
    } else if (layers()[ScreenLayerTypes.groupPopover]) {
      // cache
      entryGroupId = (layers()[ScreenLayerTypes.groupPopover].data as MiniEntryGroupConfig)?.id;
    }
    // get entryGroup date from global config. the data will be updated once user add/edit an entry
    const normalHpConfig = getUserHomepageConfig()[1] as NormalHomepageConfig;
    if (normalHpConfig) {
      for (let item of normalHpConfig.items) {
        if (item.type === MiniEntryGroupType && item.id === entryGroupId) {
          return item;
        }
      }
    } else {
      return undefined;
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
