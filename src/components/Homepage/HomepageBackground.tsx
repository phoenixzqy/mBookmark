import { createMemo, useContext } from "solid-js";

import type { ScreenLayerContextState } from "../ScreenLayerManager";
import { ScreenLayerManagerContext } from "../ScreenLayerManager";
import { ScreenLayerTypes } from "../../utils/constants";
import bgPoster from "../../assets/maxresdefault.webp";
import bgVideo from "../../assets/default_live_wallpaper.webm"

export default function HomepageBackground() {
  const { currentScreenLayer } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState;
  const show = createMemo(() => currentScreenLayer().type === ScreenLayerTypes.homepage);
  return (
    <div class="homepage-background">
      <video
        id="background-video"
        autoplay
        loop
        muted
        poster={bgPoster}
        class={show() ? "background-show" : "background-hide"}
      >
        <source src={bgVideo} type="video/webm" />
      </video>
    </div>
  );
}