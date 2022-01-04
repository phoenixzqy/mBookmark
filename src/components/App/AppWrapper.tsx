import { onMount, useContext } from "solid-js"
import { appConfig, AppContext } from "."
import type { AppContextState } from ".";
import { HomepageBackground, HomepageGroup } from "../Homepage";
import sampleData from "../../utils/sampleData.json";
import { PopoverTypes } from "../../utils/constants";
import { Popovers } from "../Popovers";

export default function AppWrapper() {
  const { getUserHomepageConfig, setUserConfig } = useContext(AppContext) as AppContextState;
  onMount(() => {
    setUserConfig(sampleData as appConfig);
  });

  return <>
    <HomepageBackground />
    {/* Preload all screen layers which are managed by screenLayerManager */}
    <HomepageGroup config={getUserHomepageConfig()}/>
    <Popovers config={{ type: PopoverTypes.group}} />
    <Popovers config={{ type: PopoverTypes.addEntry}} />
    <Popovers config={{ type: PopoverTypes.editEntry}} />
  </>
}