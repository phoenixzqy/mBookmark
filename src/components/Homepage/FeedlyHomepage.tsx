import { createSignal } from "solid-js";
import { BaseHomepageConfig } from './Homepage';

interface FeedlyHomepageConfig extends BaseHomepageConfig{
}

export default function FeedlyHomepage(props) {
  const [config, setConfig] = createSignal(props.config as FeedlyHomepageConfig);
  return (
    <div class="homepage-app-container">
    </div>
  );
}

export type { FeedlyHomepageConfig };
