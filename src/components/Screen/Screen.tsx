import { createSignal } from "solid-js";
import { ScreenTypes } from '../../utils/constants';
import FeedlyScreen from './FeedlyScreen';
import NormalScreen from './NormalScreen';
import WidgetsScreen from './WidgetsScreen'


interface BaseScreenConfig {
  type: ScreenTypes
}

export default function Screen(props) {
  const [config] = createSignal(props.config as BaseScreenConfig);
  function getScreenTemplate() {
    if (config().type === ScreenTypes.feedly) return <FeedlyScreen config={config()}/>
    else if (config().type === ScreenTypes.normal) return <NormalScreen config={config()}/>
    else if (config().type === ScreenTypes.widgets) return <WidgetsScreen config={config()}/>
    else return <span>Unsupported screen type</span>
  }
  return (
    <> {getScreenTemplate()} </>
  );
}

export type { BaseScreenConfig };

