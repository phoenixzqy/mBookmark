import type { BaseHomepageConfig, FeedlyHomepageConfig, NormalHomepageConfig, WidgetsHomepageConfig } from '../Homepage';
import { AppProvider } from ".";
import AppWrapper from './AppWrapper';
import { ScreenLayerManagerProvider } from '../ScreenLayerManager';

interface appConfig {
  siteConfig: any,
  homepages: (BaseHomepageConfig | FeedlyHomepageConfig | NormalHomepageConfig | WidgetsHomepageConfig)[]
}

export default function App() {
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