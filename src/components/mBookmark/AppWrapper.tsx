import { AppContext, appConfig } from "."
import { HomepageBackground, HomepageGroup } from "../Homepage";
import { Show, createMemo, onMount, useContext } from 'solid-js';

import type { AppContextState } from ".";
import { PopoverTypes } from "../../utils/constants";
import { Popovers } from "../Popovers";
import sampleData from "../../utils/sampleData.json";

export default function AppWrapper() {
  const { getUserHomepageConfig, setUserConfig, userConfig } = useContext(AppContext) as AppContextState;
  const isAppReady = createMemo(() => {
    return userConfig().homepages.length > 0
  });
  onMount(() => {
    setUserConfig(sampleData as appConfig);
  });

  return <>
    <HomepageBackground />
    <Show when={isAppReady()} children={<></>}>
      {/* Preload all screen layers which are managed by screenLayerManager */}
      <HomepageGroup config={userConfig().homepages} />
      <Popovers config={{ type: PopoverTypes.group }} />
      <Popovers config={{ type: PopoverTypes.addEntry }} />
      <Popovers config={{ type: PopoverTypes.editEntry }} />
      <Popovers config={{ type: PopoverTypes.search }} />
      <Popovers config={{ type: PopoverTypes.application }} />
    </Show>
  </>
}