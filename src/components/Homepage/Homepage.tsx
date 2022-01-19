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
  const HomepageTemplateMapper = {
    [HomepageTypes.feed]: <FeedHomepage config={config()} {...props} />,
    [HomepageTypes.normal]: <NormalHomepage config={config()} {...props} />,
    [HomepageTypes.widgets]: <WidgetsHomepage config={config()} {...props} />
  }
  return <div class="homepage">
    {HomepageTemplateMapper[config().type]}
  </div>
}

export type { BaseHomepageConfig };

