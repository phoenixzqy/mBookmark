import { HomepageBackground, HomepageGroup } from "../Homepage";
import { Show, createEffect, createMemo, createSignal, onMount, useContext } from 'solid-js';

import { AppContext } from "."
import type { AppContextState } from ".";
import { Login } from "./Login";
import { PopoverTypes } from "../../utils/constants";
import { Popovers } from "../Popovers";
import { database } from "../../utils/database";
import materialize from "../../utils/materialize";

export default function AppWrapper() {
  const { getUserHomepageConfig, setUserConfig, userConfig } = useContext(AppContext) as AppContextState;
  const isAppReady = createMemo(() => {
    return userConfig()?.homepages?.length > 0
  });
  const [isSignedIn, setIsSignedIn] = createSignal(false);
  createEffect(() => {
    if (isSignedIn()) {
      materialize.showLoader();
      database.initData().then(config => {
        setUserConfig(config);
        materialize.hideLoader();
      }).catch(e => {
        console.error(e);
        materialize.toast({ html: "Failed to initialize app", classes: "red" });
        // unset token incase invalid token offered
        database.initLocalConfig();
        setIsSignedIn(false);
        materialize.hideLoader();
      })
    }
  })
  onMount(() => {
    // find user auth from localstorage 
    setIsSignedIn(database.getToken() ? true : false);
  });

  return <>
    <HomepageBackground isSignedIn={isSignedIn} />
    <Show when={!isSignedIn()} children={<></>}>
      <Login setIsSignedIn={setIsSignedIn} />
    </Show>
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