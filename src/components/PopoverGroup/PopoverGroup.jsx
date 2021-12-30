import { useContext } from "solid-js";
import { PopoverGroupContext } from '../App';
import { Entry } from '../Entry';


function PopoverGroup() {
  const { isPopoverShow, hidePopoverGroup } = useContext(PopoverGroupContext);
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
