import { AddEntryButton, Entry, MiniEntryGroup } from '../Entry';
import type { BaseEntryConfig, BookmarkEntryConfig, MiniEntryGroupConfig } from '../Entry';
import { EntryTypes, MiniEntryGroupType } from '../../utils/constants';
import { For, createMemo } from "solid-js";

import { BaseHomepageConfig } from './Homepage';

interface NormalHomepageConfig extends BaseHomepageConfig {
  items: (MiniEntryGroupConfig | BaseEntryConfig | BookmarkEntryConfig)[]
}

export default function NormalHomepage(props) {
  const config = createMemo(() => props.config as NormalHomepageConfig);
  return (
    <div class="homepage-app-container">
      <For each={config().items} children={<></>}>
        {(item) => {
          if (item.type === MiniEntryGroupType) return <MiniEntryGroup config={item} />;
          if (Object.values(EntryTypes).includes(item.type)) return <Entry config={item} />;
          return null;
        }}
      </For>
      <AddEntryButton />
    </div>
  );
}

export type { NormalHomepageConfig };
