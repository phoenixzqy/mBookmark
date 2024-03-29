import { createMemo } from "solid-js";

export default function EntryTitle(props) {
  const name = createMemo(() => props.name);
  return (
    <span class="entry-title">
      {name()}
    </span>
  );
}
