import { useContext } from "solid-js";
import { PopoverGroupContext } from '../App';


export default function ScreenBackground() {
  const { isPopoverShow } = useContext(PopoverGroupContext);
  return (
    <div class={`screen-background ${!isPopoverShow() ? "background-show" : "background-hide"}`}>
    </div>
  );
}