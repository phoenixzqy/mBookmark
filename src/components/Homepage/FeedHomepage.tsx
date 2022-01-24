import { AppContext, AppContextState } from '../mBookmark/AppContext';

import { BaseHomepageConfig } from './Homepage';
import { useContext } from 'solid-js';

interface FeedHomepageConfig extends BaseHomepageConfig {
}

export default function FeedHomepage(props) {
  const { getUserSiteConfig } = useContext(AppContext) as AppContextState;
  const { backToHomepage } = props;
  return (
    <div class="homepage-app-container">
      <div class="feed-homepage-back-btn" onClick={() => backToHomepage()}>
        <i class="material-icons">home</i>
      </div>
      {/** NOTE: use iframe for now */}
      <div class="feed-homepage-container">
        <div class="feed-homepage-ifram-container">
          <iframe class="feed-homepage-iframe" src={getUserSiteConfig().features.feedPageUrl} title="description"></iframe>
        </div>
      </div>
    </div>
  );
}

export type { FeedHomepageConfig };
