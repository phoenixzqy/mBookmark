import { createSignal } from "solid-js";
import { HomepageTypes } from '../../utils/constants';
import FeedlyHomepage from './FeedlyHomepage';
import NormalHomepage from './NormalHomepage';
import WidgetsHomepage from './WidgetsHomepage'


interface BaseHomepageConfig {
  readonly type: HomepageTypes
}

export default function Homepage(props) {
  const [config] = createSignal(props.config as BaseHomepageConfig);
  const HomepageTemplateMapper = {
    [HomepageTypes.feedly]: <FeedlyHomepage config={config()}/>,
    [HomepageTypes.normal]: <NormalHomepage config={config()}/>,
    [HomepageTypes.widgets]: <WidgetsHomepage config={config()}/>
  }
  return <div class="homepage">
    {HomepageTemplateMapper[config().type]}
  </div>
}

export type { BaseHomepageConfig };

