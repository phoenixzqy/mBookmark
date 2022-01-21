import { ApplicationManagerContext, ApplicationManagerContextState } from '../../ApplicationManager/ApplicationManager';
import { createSignal, onMount, useContext } from 'solid-js';

import image from "../../../assets/settings.png";

export const appid = "settings";

export function Icon(props) {
  const { launchApplication } = useContext(ApplicationManagerContext) as ApplicationManagerContextState;
  return (
    <div class="image-app-icon settings-app-icon" onClick={() => {
      launchApplication(appid);
    }}>
      <img src={image}></img>
    </div>
  );
}