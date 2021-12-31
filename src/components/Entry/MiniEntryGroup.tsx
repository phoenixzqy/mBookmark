import { createSignal, For, useContext } from "solid-js";
import { PopoverGroupContext, PopoverContextState } from '../App';
import type { BookmarkEntryConfig } from './BookmarkEntry';
import type { BaseEntryConfig } from './Entry';
import { EntryTitle } from '../Entry';

interface MiniEntryGroupConfig {
  type: string,
  name: string,
  items: (BaseEntryConfig | BookmarkEntryConfig)[]
}

export default function MiniEntryGroup(props) {
  const { showPopoverGroup, setItems, setName } = useContext(PopoverGroupContext) as PopoverContextState;
  const [config, setConfig] = createSignal(props.config as MiniEntryGroupConfig);
  function handleClick() {
    setItems(config().items);
    setName(config().name);
    showPopoverGroup();
  }
  return (
    <div class="mini-entry-group-wrapper">
      <div class="mini-entry-group-container" onClick={handleClick}>
        <For each={config().items?.slice(0, 8)}>
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