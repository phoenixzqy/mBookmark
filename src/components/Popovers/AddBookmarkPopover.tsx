import { createEffect, createMemo, createSignal, useContext } from "solid-js"
import PopoverTitle from "./PopoverTitle";
import { ScreenLayerManagerContext } from "../ScreenLayerManager";
import { ScreenLayerTypes } from "../../utils/constants";
import type { ScreenLayerContextState } from "../ScreenLayerManager";

export default function AddBookmarkPopover() {
  let keywardsRef;
  // parentId is passed within params().parentId

  const [isChipsInitialized, setIsChipsInitialized] = createSignal(false);
  createEffect(() => {
    const { currentScreenLayer } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState;
    const show = createMemo(() => currentScreenLayer().type === ScreenLayerTypes.addBookmarkPopover); 
    if (show() && !isChipsInitialized()) {
      (window as any).M.Chips.init(keywardsRef, {
        data: [{
          tag: 'Apple',
        }, {
          tag: 'Microsoft',
        }, {
          tag: 'Google',
        }],
        placeholder: 'Add keyword',
        secondaryPlaceholder: '+ keyword',
        // autocompleteOptions: {
        //   data: {
        //     'Apple': null,
        //     'Microsoft': null,
        //     'Google': null
        //   },
        //   limit: Infinity,
        //   minLength: 1
        // }
      });
      setIsChipsInitialized(true);
    }
  });
  return (
    <div class={`popover-container add-entry-popover-container`}>
      <PopoverTitle name="Add Bookmark/App"/>
      <div class="row">
        <form class="col s12">
          <div class="row">
            <div class="input-field col s12">
              <input id="add-bookmark-url" type="text" class="validate"/>
              <label for="add-bookmark-url">URL</label>
            </div>
            <div class="input-field col s12">
              <input id="add-bookmark-icon-url" type="text" class="validate"/>
              <label for="add-bookmark-icon-url">Icon URL</label>
            </div>
            <div class="input-field col s12">
              <input id="add-bookmark-name" type="text" class="validate"/>
              <label for="add-bookmark-name">Site Name</label>
            </div>
            <div class="input-field col s12">
              <input id="add-bookmark-desc" type="text" class="validate"/>
              <label for="add-bookmark-desc">Site Description</label>
            </div>
            <div class="input-field col s12">
              <div ref={keywardsRef} id="add-bookmark-keywords" class="chips chips-placeholder chips-autocomplete"></div>
              <label for="add-bookmark-keywords" style={{top: "-25px"}}>keywords</label>
            </div>
          </div>
        </form>
      </div>
    </div>

  )
}
