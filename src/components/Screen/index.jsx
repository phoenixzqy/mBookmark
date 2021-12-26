import style from './index.css';
import Group from '../Group';
import Entry from '../Entry';


function Screen({showPopoverGroup}) {
  return (
    <div class="screen">
      <Group showPopoverGroup={showPopoverGroup}/>
      <Group showPopoverGroup={showPopoverGroup}/>
      <Entry />
      <Entry />
    </div>
  );
}

export default Screen;
