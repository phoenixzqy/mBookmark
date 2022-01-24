import FeedHomepage from './FeedHomepage';
import { HomepageTypes } from '../../utils/constants';
import NormalHomepage from './NormalHomepage';
import WidgetsHomepage from './WidgetsHomepage'
import { createSignal } from "solid-js";

interface BaseHomepageConfig {
  readonly type: HomepageTypes
}

export default function Homepage(props) {
  const [config] = createSignal(props.config as BaseHomepageConfig);
  function getHomepageElement(type: HomepageTypes) {
    switch (type) {
      case HomepageTypes.feed:
        return <FeedHomepage config={config()} {...props} />;
      case HomepageTypes.normal:
        return <NormalHomepage config={config()} {...props} />;
      case HomepageTypes.widgets:
        return <WidgetsHomepage config={config()} {...props} />
    }
  }
  return <div class="homepage">
    {getHomepageElement(config().type)}
  </div>
}

export type { BaseHomepageConfig };

