import { AddEntryButton, Entry, MiniEntryGroup } from '../Entry';
import type { BaseEntryConfig, BookmarkEntryConfig, MiniEntryGroupConfig } from '../Entry';
import { EntryTypes, MiniEntryGroupType } from '../../utils/constants';
import { For, Show, createMemo, onMount } from 'solid-js';

import { BaseHomepageConfig } from './Homepage';

interface NormalHomepageConfig extends BaseHomepageConfig {
  items: (MiniEntryGroupConfig | BaseEntryConfig | BookmarkEntryConfig)[]
}

export default function NormalHomepage(props) {
  const config = createMemo(() => props.config as NormalHomepageConfig);
  const capacity = createMemo(() => {
    return props.capacity as number
  });
  onMount(() => {

  })
  return (
    <div class="homepage-app-container">
      <For each={config().items} children={<></>}>
        {(item) => {
          if (item.type === MiniEntryGroupType) return <MiniEntryGroup config={item} isDraggable={true} />;
          if (Object.values(EntryTypes).includes(item.type)) return <Entry config={item} isDraggable={true} />;
          return null;
        }}
      </For>
      <Show when={(config()?.items?.length || 0) < capacity()} children={<></>}>
        <AddEntryButton />
      </Show>
    </div>
  );
}

export type { NormalHomepageConfig };
