import { onCleanup, onMount, useContext } from "solid-js";
import { PopoverGroupContext, PopoverContextState } from '../App';
import { Entry } from '../Entry';
import { EscapeKey } from "../../utils/constants";


function PopoverGroup() {
  const { isPopoverShow, hidePopoverGroup } = useContext(PopoverGroupContext) as PopoverContextState;
  function handleKeyPress(event:KeyboardEvent): void {
    if (!isPopoverShow()) return;
    const { key } = event; 
    if (!key) return;
    if (key === EscapeKey) {
      hidePopoverGroup();
    }
  }
  onMount(() => {
    window.addEventListener("keydown", handleKeyPress);
  });
  onCleanup(() => {
    window.removeEventListener("keydown", handleKeyPress);
  })
  return (
    <div class={`popover-group ${isPopoverShow() ? "popover-group-show" : "popover-group-hide"}` }>
      <div class="popover-bg" onClick={hidePopoverGroup}></div>
      <div class={`popover-group-container ${isPopoverShow() ? "popover-group-container-show" : "popover-group-container-hide"}`}>
        <Entry />
        <Entry />
        <Entry />
        <Entry />
        <Entry />
        <Entry />
        <Entry />
        <Entry />
        <Entry />
        <Entry />
        <Entry />
        <Entry />
      </div>
    </div>
  );
}

export default PopoverGroup;
