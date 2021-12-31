import { createSignal, createContext, lazy } from "solid-js";
import { ScreenGroup, ScreenBackground} from '../Screen';
import config from "../../config";
import sampleData from "../../utils/sampleData.json";
import type { BaseScreenConfig, FeedlyScreenConfig, NormalScreenConfig, WidgetsScreenConfig } from '../Screen';
import type { BookmarkEntryConfig, BaseEntryConfig } from "../Entry";
const PopoverGroup = lazy(() => import('../PopoverGroup/PopoverGroup'));

export const PopoverGroupContext = createContext();

interface PopoverContextState {
  isPopoverShow: () => boolean,
  showPopoverGroup: () => void,
  hidePopoverGroup: () => void,
  name: () => string,
  setName: (string) => void,
  items: () => (BaseEntryConfig | BookmarkEntryConfig)[],
  setItems: (items: (BaseEntryConfig | BookmarkEntryConfig)[]) => void
}

export function PopoverGroupProvidor(props) {
  const [isPopoverShow, setPopoverShow] = createSignal(false);
  const [items, setItems] = createSignal([]);
  const [name, setName] = createSignal("");
  const state: PopoverContextState = {
    isPopoverShow,
    showPopoverGroup: () => setPopoverShow(true),
    hidePopoverGroup: () => setPopoverShow(false),
    name,
    setName,
    items,
    setItems
  };
  return <PopoverGroupContext.Provider value={state}>
      {props.children}
    </PopoverGroupContext.Provider>;
}

interface appConfig {
  siteConfig: any,
  screens: (BaseScreenConfig | FeedlyScreenConfig | NormalScreenConfig | WidgetsScreenConfig)[]
}

export default function App() {
  const [config, setConfig] = createSignal(sampleData as appConfig);
  return (
    <div class="app">
      <PopoverGroupProvidor>
        <ScreenBackground />
        <ScreenGroup config={config().screens}/>
        <PopoverGroup />
      </PopoverGroupProvidor>
    </div>
  );
}

export type { PopoverContextState };