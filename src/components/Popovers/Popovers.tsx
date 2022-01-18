import { AddBookmarkPopover, EditBookmarkPopover, GroupPopover } from ".";
import { AppContext, AppContextState } from "../App";
import { PopoverTypes, ScreenLayerTypes } from "../../utils/constants";
import { createMemo, onMount, useContext } from "solid-js";

import { Draggable } from "../../utils/draggable";
import type { ScreenLayerContextState } from '../ScreenLayerManager'
import { ScreenLayerManagerContext } from "../ScreenLayerManager";
import SearchPopover from './SearchPopover';

interface PopoversConfig {
  type: PopoverTypes
}

export default function (props) {
  let bgRef;
  const { moveEntryOutFromMoniGroup } = useContext(AppContext) as AppContextState;
  const config = createMemo(() => props.config as PopoversConfig);
  const { backToPrevLayer, register } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState;
  function PopoverFactory(type: PopoverTypes) {
    switch (type) {
      case PopoverTypes.group:
        return <GroupPopover />
      case PopoverTypes.addEntry:
        return <AddBookmarkPopover />;
      case PopoverTypes.editEntry:
        return <EditBookmarkPopover />;
      case PopoverTypes.search:
        return <SearchPopover />
      default:
        return null;
    }
  }
  const PopoverToScreenLayerMapper = {
    [PopoverTypes.group]: ScreenLayerTypes.groupPopover,
    [PopoverTypes.addEntry]: ScreenLayerTypes.addBookmarkPopover,
    [PopoverTypes.editEntry]: ScreenLayerTypes.editBookmarkPopover,
    [PopoverTypes.search]: ScreenLayerTypes.searchPopover
  }
  let ref;
  onMount(() => {
    register({
      type: PopoverToScreenLayerMapper[config().type as PopoverTypes],
      ref
    });
    Draggable.onDragMove(bgRef)
    Draggable.onDragEnd(bgRef, (e, ele) => {
      const data = Draggable.getData();
      if (data && data.dragging) {
        // move to the end
        moveEntryOutFromMoniGroup(data.dragging.id, -1);
        backToPrevLayer();
      }
    });
  });
  return (
    <div ref={ref} class="popovers">
      <div ref={bgRef} class="popover-bg" onClick={backToPrevLayer}></div>
      {PopoverFactory(config().type as PopoverTypes)}
    </div>
  );
}