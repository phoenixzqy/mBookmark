import { createMemo, onMount, useContext } from "solid-js";
import { AddBookmarkPopover, EditBookmarkPopover, GroupPopover } from ".";
import { PopoverTypes, ScreenLayerTypes } from "../../utils/constants";
import { ScreenLayerManagerContext } from "../ScreenLayerManager";
import type { ScreenLayerContextState } from '../ScreenLayerManager'

interface PopoversConfig {
  type: PopoverTypes
}

export default function (props) {
  const config = createMemo(() => props.config as PopoversConfig);
  const { backToPrevLayer, register } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState;
  const PopoverMapper = {
    [PopoverTypes.group]: <GroupPopover />,
    [PopoverTypes.addEntry]: <AddBookmarkPopover />,
    [PopoverTypes.editEntry]: <EditBookmarkPopover />
  }
  const PopoverToScreenLayerMapper = {
    [PopoverTypes.group]: ScreenLayerTypes.groupPopover,
    [PopoverTypes.addEntry]: ScreenLayerTypes.addBookmarkPopover,
    [PopoverTypes.editEntry]: ScreenLayerTypes.editBookmarkPopover
  }
  let ref;
  onMount(() => {
    register({
      type: PopoverToScreenLayerMapper[config().type as PopoverTypes],
      ref
    });
  });
  return (
    <div ref={ref} class="popovers">
      <div class="popover-bg" onClick={backToPrevLayer}></div>
      {PopoverMapper[config().type as PopoverTypes]}
    </div>
  );
}