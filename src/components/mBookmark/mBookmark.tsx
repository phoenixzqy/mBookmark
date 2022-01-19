import type { BaseHomepageConfig, FeedHomepageConfig, NormalHomepageConfig, WidgetsHomepageConfig } from '../Homepage';

import { AppProvider } from ".";
import AppWrapper from './AppWrapper';
import { ScreenLayerManagerProvider } from '../ScreenLayerManager';

interface appConfig {
  siteConfig: any,
  homepages: (BaseHomepageConfig | FeedHomepageConfig | NormalHomepageConfig | WidgetsHomepageConfig)[]
}

export function mBookmark() {
  return (
    <div class="app">
      <AppProvider>
        <ScreenLayerManagerProvider>
          <AppWrapper></AppWrapper>
        </ScreenLayerManagerProvider>
      </AppProvider>
    </div>
  );
}

export type { appConfig };