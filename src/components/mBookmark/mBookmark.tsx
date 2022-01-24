import type { BaseHomepageConfig, FeedHomepageConfig, NormalHomepageConfig, WidgetsHomepageConfig } from '../Homepage';

import { AppProvider } from ".";
import AppWrapper from './AppWrapper';
import { ApplicationManagerProvider } from '../ApplicationManager/ApplicationManager';
import { Loading } from '../Materialize';
import { ScreenLayerManagerProvider } from '../ScreenLayerManager';
import { SiteConfig } from './AppContext';

export interface appConfig {
  siteConfig: SiteConfig,
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
      <Loading />
    </div>
  );
}