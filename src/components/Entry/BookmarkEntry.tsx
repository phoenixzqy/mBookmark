import EntryTitle from './EntryTitle';
import type { BaseEntryConfig } from './Entry';
import { createMemo } from 'solid-js';

interface BookmarkEntryConfig extends BaseEntryConfig{
  url: string,
  icon: string,
  name: string,
  description: string,
  keywords: string[]
}

export default function BookmarkEntry(props) {
  const config = createMemo(() => props.config as BookmarkEntryConfig);
  function handleClick() {
    window.open(config().url);
  }
  return (
    <div class="entry-wrapper">
      <div class="entry-container"
        title={`${config().name}: ${config().description}`}
        style={{
          "background-image": config().icon ? `url("${config().icon}")` : undefined
        }}
        onClick={handleClick}
      ></div>
      <EntryTitle name={config().name} />
    </div>
  );
}

export type { BookmarkEntryConfig };