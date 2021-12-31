import { createSignal, useContext } from "solid-js";
import { PopoverGroupContext, PopoverContextState } from '../App';
import { BaseScreenConfig } from './Screen';

interface WidgetsScreenConfig extends BaseScreenConfig{
}

export default function WidgetsScreen(props) {
  const { isPopoverShow } = useContext(PopoverGroupContext) as PopoverContextState;
  const [config, setConfig] = createSignal(props.config as WidgetsScreenConfig);
  return (
    <div class="screen">
      <div class={`screen-app-container ${!isPopoverShow() ? "screen-app-container-show" : "screen-app-container-hide"}`}>
      </div>
    </div>
  );
}

export type { WidgetsScreenConfig };
