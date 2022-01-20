import { createSignal, onMount } from 'solid-js';

import image from "../../../assets/barcode.png";

export function Icon(props) {
  return (
    <div class="image-app-icon barcode-app-icon" onClick={() => {
      // TODO:
    }}>
      <img src={image}></img>
    </div>
  );
}