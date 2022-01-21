import type { BaseHomepageConfig, FeedHomepageConfig, NormalHomepageConfig, WidgetsHomepageConfig } from '../Homepage';

import { AppProvider } from ".";
import AppWrapper from './AppWrapper';
import { ApplicationManagerProvider } from '../ApplicationManager/ApplicationManager';
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
          <ApplicationManagerProvider>
            <AppWrapper></AppWrapper>
          </ApplicationManagerProvider>
        </ScreenLayerManagerProvider>
      </AppProvider>
    </div>
  );
}

export type { appConfig };