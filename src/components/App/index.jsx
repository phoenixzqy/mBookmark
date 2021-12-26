import { createSignal, onCleanup } from "solid-js";
import style from './index.css';
import Screen from '../Screen';
import PopoverGroup from '../PopoverGroup';

function App() {
  const [isShowPopover, setShowPopover] = createSignal(false);
  function showPopoverGroup() {
    setShowPopover(true);
  }
  function hidePopoverGroup() {
    setShowPopover(false);
  }
  return (
    <div class="app">
      <Screen showPopoverGroup={showPopoverGroup}/>
      <PopoverGroup isShow={isShowPopover} hidePopoverGroup={hidePopoverGroup}/>
    </div>
  );
}

export default App;
