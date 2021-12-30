import { createSignal, createContext, lazy } from "solid-js";
import { ScreenGroup, ScreenBackground} from '../Screen';
const PopoverGroup = lazy(() => import('../PopoverGroup/PopoverGroup'));

export const PopoverGroupContext = createContext();

export function PopoverGroupProvidor(props) {
  const [isPopoverShow, setPopoverShow] = createSignal(false);
  const state = {
    isPopoverShow,
    showPopoverGroup: () => setPopoverShow(true),
    hidePopoverGroup: () => setPopoverShow(false)
  };
  return <PopoverGroupContext.Provider value={state}>
      {props.children}
    </PopoverGroupContext.Provider>;
}

export default function App() {
  return (
    <div class="app">
      <PopoverGroupProvidor>
        <ScreenBackground />
        <ScreenGroup />
        <PopoverGroup />
      </PopoverGroupProvidor>
    </div>
  );
}