import { createMemo, useContext } from "solid-js";
import { ScreenLayerTypes } from "../../utils/constants";
import { ScreenLayerManagerContext } from "../ScreenLayerManager";
import type { ScreenLayerContextState } from "../ScreenLayerManager";

export default function AddEntryButton(props) {
  const parentId = createMemo(() => props.parentId);
  const { showLayer } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState
  function handleClick() {
    showLayer({
      type: ScreenLayerTypes.addBookmarkPopover,
      data: { parentId }
    });
  }
  return (
    <div class="entry-wrapper">
      <div 
        class="add-entry-button-container"
        title="Add an app/bookmark"
        onclick={handleClick}
      ></div>
    </div>
  );
}