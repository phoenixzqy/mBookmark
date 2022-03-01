import { ApplicationManagerContext, ApplicationManagerContextState } from '../../ApplicationManager/ApplicationManager';
import { createSignal, onMount, useContext } from 'solid-js';

export const appid = "readme";

export function Icon(props) {
  const onclick = () => {
    window.open('https://github.com/phoenixzqy/mBookmark#mbookmark', '_blank');
  }
  return (
    <div class="font-app-icon readme-app-icon" onClick={() => onclick()}>
      <i class="material-icons">local_library</i>
    </div>
  );
}