import { createSignal, useContext } from "solid-js";
import { PopoverGroupContext, PopoverContextState } from '../App';
import { BaseScreenConfig } from './Screen';

interface FeedlyScreenConfig extends BaseScreenConfig{
}

export default function FeedlyScreen(props) {
  const { isPopoverShow } = useContext(PopoverGroupContext) as PopoverContextState;
  const [config, setConfig] = createSignal(props.config as FeedlyScreenConfig);
  return (
    <div class="screen">
      <div class={`screen-app-container ${!isPopoverShow() ? "screen-app-container-show" : "screen-app-container-hide"}`}>
      </div>
    </div>
  );
}

export type { FeedlyScreenConfig };
