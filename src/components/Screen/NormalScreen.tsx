import { createSignal, useContext, For } from "solid-js";
import { PopoverGroupContext, PopoverContextState } from '../App';
import { Entry, MiniEntryGroup } from '../Entry';
import { BaseScreenConfig } from './Screen';
import { MiniEntryGroupType, EntryTypes } from '../../utils/constants';
import type { MiniEntryGroupConfig, BaseEntryConfig, BookmarkEntryConfig } from '../Entry';


interface NormalScreenConfig extends BaseScreenConfig{
  items: (MiniEntryGroupConfig | BaseEntryConfig | BookmarkEntryConfig) []
}

export default function NormalScreen(props) {
  const { isPopoverShow } = useContext(PopoverGroupContext) as PopoverContextState;
  const [config, setConfig] = createSignal(props.config as NormalScreenConfig);
  return (
    <div class="screen">
      <div class={`screen-app-container ${!isPopoverShow() ? "screen-app-container-show" : "screen-app-container-hide"}`}>
        <For each={config().items}>
          {(item) => {
            if (item.type === MiniEntryGroupType) return <MiniEntryGroup config={item}/>;
            if (Object.values(EntryTypes).includes(item.type)) return <Entry config={item}/>;
            return null;
          }}
        </For>
      </div>
    </div>
  );
}

export type { NormalScreenConfig };
