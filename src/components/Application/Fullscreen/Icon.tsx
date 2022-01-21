import { createSignal, onMount } from 'solid-js';

export const appid = "fullscreen";

export function Icon(props) {
  const [fullscreen, setFullscreen] = createSignal(false);
  onMount(() => {
    document.addEventListener("fullscreenchange", function () {
      setFullscreen(!fullscreen())
    });
  });
  return (
    <div class="font-app-icon fullscreen-app-icon" onClick={() => {
      if (!fullscreen()) {
        document.body.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }}>
      <i class="material-icons">{!fullscreen() ? "fullscreen" : "fullscreen_exit"}</i>
    </div>
  );
}