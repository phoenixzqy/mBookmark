import BookmarkEntry from './BookmarkEntry';
import { EntryTypes } from '../../utils/constants';
import { createMemo } from 'solid-js';

interface BaseEntryConfig {
  readonly id: string,
  readonly type: EntryTypes,
}

export default function Entry(props) {
  const { isDraggable = false } = props;
  const config = createMemo(() => props.config as BaseEntryConfig);
  const EntryTemplateMapper = {
    [EntryTypes.bookemark]: <BookmarkEntry config={config()} isDraggable={isDraggable} />
  };
  return <>{EntryTemplateMapper[config().type]}</>
}

export type { BaseEntryConfig };