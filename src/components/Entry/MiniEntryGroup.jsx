import { useContext } from "solid-js";
import { PopoverGroupContext } from '../App';

export default function MiniEntryGroup() {
  const { showPopoverGroup } = useContext(PopoverGroupContext);
  return (
    <div class="group-wrapper">
      <div class="group-container" onClick={showPopoverGroup}>
        <div class="inner-app"></div>
        <div class="inner-app"></div>
        <div class="inner-app"></div>
        <div class="inner-app"></div>
        <div class="inner-app"></div>
        <div class="inner-app"></div>
        <div class="inner-app"></div>
        <div class="inner-app"></div>
        <div class="inner-app"></div>
        <div class="inner-app"></div>
        <div class="inner-app"></div>
        <div class="inner-app"></div>
        <div class="inner-app"></div>
        <div class="inner-app"></div>
        <div class="inner-app"></div>
      </div>
    </div>
  );
}