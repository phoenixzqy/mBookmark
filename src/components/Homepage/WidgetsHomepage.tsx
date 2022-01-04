import { createSignal } from "solid-js";
import { BaseHomepageConfig } from './Homepage';

interface WidgetsHomepageConfig extends BaseHomepageConfig{
}

export default function WidgetsHomepage(props) {
  const [config, setConfig] = createSignal(props.config as WidgetsHomepageConfig);
  return (
    <div class="homepage-app-container">
    </div>
  );
}

export type { WidgetsHomepageConfig };
