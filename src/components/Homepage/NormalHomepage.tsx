import { useContext, For, createMemo } from "solid-js";
import { PopoversContext } from '../Popovers';
import type { PopoverContextState } from "../Popovers";
import { Entry, MiniEntryGroup, AddEntryButton } from '../Entry';
import { BaseHomepageConfig } from './Homepage';
import { MiniEntryGroupType, EntryTypes } from '../../utils/constants';
import type { MiniEntryGroupConfig, BaseEntryConfig, BookmarkEntryConfig } from '../Entry';


interface NormalHomepageConfig extends BaseHomepageConfig{
  items: (MiniEntryGroupConfig | BaseEntryConfig | BookmarkEntryConfig) []
}

export default function NormalHomepage(props) {
  const config = createMemo(() => props.config as NormalHomepageConfig);
  return (
    <div class="homepage-app-container">
      <For each={config().items} children={<></>}>
        {(item) => {
          if (item.type === MiniEntryGroupType) return <MiniEntryGroup config={item}/>;
          if (Object.values(EntryTypes).includes(item.type)) return <Entry config={item}/>;
          return null;
        }}
      </For>
      <AddEntryButton />
    </div>
  );
}

export type { NormalHomepageConfig };
