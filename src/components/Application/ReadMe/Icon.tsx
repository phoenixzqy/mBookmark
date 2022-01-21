import { ApplicationManagerContext, ApplicationManagerContextState } from '../../ApplicationManager/ApplicationManager';
import { createSignal, onMount, useContext } from 'solid-js';

export const appid = "readme";

export function Icon(props) {
  const { launchApplication } = useContext(ApplicationManagerContext) as ApplicationManagerContextState;
  return (
    <div class="font-app-icon readme-app-icon" onClick={() => {
      launchApplication(appid);
    }}>
      <i class="material-icons">local_library</i>
    </div>
  );
}