import style from './index.css';
import Screen from '../Screen';
import Entry from '../Entry';

function PopoverGroup({isShow, hidePopoverGroup}) {
  return (
    <div style={{ display: isShow() ? "block" : "none"}}>
      <div class="popover_bg" onClick={hidePopoverGroup}></div>
      <div class="popover_group_container">
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
