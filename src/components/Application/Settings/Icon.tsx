import { createSignal, onMount } from 'solid-js';

import image from "../../../assets/settings.png";

export function Icon(props) {
  return (
    <div class="image-app-icon settings-app-icon" onClick={() => {
      // TODO:
    }}>
      <img src={image}></img>
    </div>
  );
}