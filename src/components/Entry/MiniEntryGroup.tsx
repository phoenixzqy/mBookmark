import { useContext } from "solid-js";
import { PopoverGroupContext, PopoverContextState } from '../App';

export default function MiniEntryGroup() {
  const { showPopoverGroup } = useContext(PopoverGroupContext) as PopoverContextState;
  return (
    <div class="mini-entry-group-wrapper">
      <div class="mini-entry-group-container" onClick={showPopoverGroup}>
        <div class="mini-entry-inner-app"></div>
        <div class="mini-entry-inner-app"></div>
        <div class="mini-entry-inner-app"></div>
        <div class="mini-entry-inner-app"></div>
        <div class="mini-entry-inner-app"></div>
        <div class="mini-entry-inner-app"></div>
        <div class="mini-entry-inner-app"></div>
        <div class="mini-entry-inner-app"></div>
        <div class="mini-entry-inner-app"></div>
        <div class="mini-entry-inner-app"></div>
        <div class="mini-entry-inner-app"></div>
        <div class="mini-entry-inner-app"></div>
        <div class="mini-entry-inner-app"></div>
        <div class="mini-entry-inner-app"></div>
        <div class="mini-entry-inner-app"></div>
      </div>
    </div>
  );
}