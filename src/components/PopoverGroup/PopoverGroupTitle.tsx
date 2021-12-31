import { createMemo } from "solid-js";

export default function PopoverGroupTitle(props) {
  const name = createMemo(() => props.name);
  return (
    <span class="popover-group-title">
      {name()}
    </span>
  );
}
