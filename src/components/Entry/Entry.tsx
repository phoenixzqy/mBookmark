import { createMemo } from 'solid-js';
import { EntryTypes } from '../../utils/constants';
import BookmarkEntry from './BookmarkEntry';

interface BaseEntryConfig {
  readonly id: string,
  readonly type: EntryTypes,
}

export default function Entry(props) {
  const config = createMemo(() => props.config as BaseEntryConfig);
  const EntryTemplateMapper = {
    [EntryTypes.bookemark]: <BookmarkEntry config={config()} />
  };
  return <>{EntryTemplateMapper[config().type]}</>
}

export type { BaseEntryConfig };