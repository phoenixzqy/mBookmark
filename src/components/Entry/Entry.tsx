import ApplicationEntry from './ApplicationEntry';
import BookmarkEntry from './BookmarkEntry';
import { EntryTypes } from '../../utils/constants';
import { createMemo } from 'solid-js';

interface BaseEntryConfig {
  readonly id: string,
  readonly type: EntryTypes,
}

export default function Entry(props) {
  const config = createMemo(() => props.config as BaseEntryConfig);
  const { style = {} } = props;
  const myProps = { style };
  function getEntryTemplate(type: EntryTypes) {
    switch (type) {
      case EntryTypes.application:
        return <ApplicationEntry config={config()} {...myProps} />
      case EntryTypes.bookemark:
        return <BookmarkEntry config={config()} {...myProps} />
      default:
        return null;
    }
  }
  return <>{getEntryTemplate(config().type)}</>
}

export type { BaseEntryConfig };