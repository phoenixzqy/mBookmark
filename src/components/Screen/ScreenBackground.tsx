import { useContext } from "solid-js";
import { PopoverGroupContext, PopoverContextState } from '../App';


export default function ScreenBackground() {
  const { isPopoverShow } = useContext(PopoverGroupContext) as PopoverContextState;
  return (
    <div class={`screen-background ${!isPopoverShow() ? "background-show" : "background-hide"}`}>
    </div>
  );
}