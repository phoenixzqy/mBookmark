import { createMemo } from "solid-js";

export default function GroupPopoverTitle(props) {
  const name = createMemo(() => props.name);
  return (
    <span class="popover-title">
      {name()}
    </span>
  );
}
