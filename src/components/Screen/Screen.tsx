import { createSignal, useContext, For } from "solid-js";
import { PopoverGroupContext, PopoverContextState } from '../App';
import { Entry, MiniEntryGroup } from '../Entry';


function Screen() {
  const { isPopoverShow } = useContext(PopoverGroupContext) as PopoverContextState;
  const [items, setItems] = createSignal([
    {
      type: "group",
    },
    {
      type: "group",
    },
    {
     type: "entry",
    },
    {
      type: "entry",
    }
  ]);
  return (
    <div class="screen">
      <div class={`screen-app-container ${!isPopoverShow() ? "screen-app-container-show" : "screen-app-container-hide"}`}>
        <For each={items()}>
          {(item) => {
            if (item.type === "group") return <MiniEntryGroup />;
            if (item.type === "entry") return <Entry />;
            return null;
          }}
        </For>
      </div>
    </div>
  );
}

export default Screen;
