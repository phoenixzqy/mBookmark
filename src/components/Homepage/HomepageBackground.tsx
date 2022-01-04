import { createMemo, useContext } from "solid-js";
import { ScreenLayerManagerContext } from "../ScreenLayerManager";
import type { ScreenLayerContextState } from "../ScreenLayerManager";
import { ScreenLayerTypes } from "../../utils/constants";


export default function HomepageBackground() {
  const { currentScreenLayer } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState;
  const show = createMemo(() => currentScreenLayer().type === ScreenLayerTypes.homepage);
  return (
    <div class={`homepage-background ${show() ? "background-show" : "background-hide"}`}>
    </div>
  );
}