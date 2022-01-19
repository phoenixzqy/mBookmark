import { BaseHomepageConfig } from './Homepage';
import { createSignal } from "solid-js";

interface FeedHomepageConfig extends BaseHomepageConfig {
}

export default function FeedHomepage(props) {
  const [config, setConfig] = createSignal(props.config as FeedHomepageConfig);
  return (
    <div class="homepage-app-container">
      {/** NOTE: use iframe for now */}
      <div class="feed-homepage-container">
        <div class="feed-homepage-ifram-container">
          <iframe class="feed-homepage-iframe" src="https://juejin.cn/" title="description"></iframe>
        </div>
      </div>
    </div>
  );
}

export type { FeedHomepageConfig };
