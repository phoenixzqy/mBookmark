import { AppContext, AppContextState } from "../mBookmark";
import { ScreenLayerTypes, wallpaperTypes } from "../../utils/constants";
import { createMemo, useContext } from "solid-js";

import type { ScreenLayerContextState } from "../ScreenLayerManager";
import { ScreenLayerManagerContext } from "../ScreenLayerManager";
import bgImage from "../../assets/default_wallpaper.jpg"
import bgPoster from "../../assets/maxresdefault.webp";
import bgVideo from "../../assets/default_live_wallpaper.webm";

export default function HomepageBackground(props) {
  const { isSignedIn } = props;
  const { currentScreenLayer } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState;
  const { getUserSiteConfig } = useContext(AppContext) as AppContextState;
  const show = createMemo(() => (currentScreenLayer().type === ScreenLayerTypes.homepage && isSignedIn()));
  return (
    <div class="homepage-background">
      {getUserSiteConfig()?.appearance?.wallpaperType === wallpaperTypes.image ?
        <div
          style={{
            "background-image": `url("${getUserSiteConfig()?.appearance?.wallpaperUrl ? getUserSiteConfig()?.appearance?.wallpaperUrl : bgImage}"`,
            "background-size": "cover",
            height: "100%",
            width: "100%"
          }}
          class={show() ? "background-show" : "background-hide"}
        ></div> :
        <video
          id="background-video"
          autoplay
          loop
          muted
          poster={getUserSiteConfig()?.appearance?.wallpaperUrl ? getUserSiteConfig()?.appearance?.wallpaperUrl : bgPoster}
          class={show() ? "background-show" : "background-hide"}
        >
          <source src={getUserSiteConfig()?.appearance?.wallpaperUrl ? getUserSiteConfig()?.appearance?.wallpaperUrl : bgVideo} type="video/webm" />
        </video>
      }
    </div>
  );
}