import { createSignal } from 'solid-js';
import { EntryTypes } from '../../utils/constants';
import BookmarkEntry from './BookmarkEntry';


interface BaseEntryConfig {
  type: EntryTypes,
}

export default function Entry(props) {
  const [config, setConfig] = createSignal(props.config as BaseEntryConfig);
  function getEntryTemplate() {
    if (config().type === EntryTypes.bookemark) {
      return <BookmarkEntry config={config()} />
    } else {
      return <span>Unsupported entry type</span>
    }
  }
  return (
    <>
      {getEntryTemplate()}
    </>
  );
}

export type { BaseEntryConfig };