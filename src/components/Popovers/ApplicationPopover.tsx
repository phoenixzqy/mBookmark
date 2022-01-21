import { ApplicationManagerContext, ApplicationManagerContextState } from '../ApplicationManager/ApplicationManager';
import { ScreenLayerContextState, ScreenLayerManagerContext } from '../ScreenLayerManager';
import { createMemo, useContext } from 'solid-js';

import { ScreenLayerTypes } from '../../utils/constants';

export default function ApplicationPopover(props) {
  const { currentScreenLayer, backToPrevLayer } = useContext(ScreenLayerManagerContext) as ScreenLayerContextState;
  const { applications, currentApplication } = useContext(ApplicationManagerContext) as ApplicationManagerContextState;
  const show = createMemo(() => currentScreenLayer().type === ScreenLayerTypes.applicationPopover);
  function getApplicationElement() {
    const Application = applications()?.[currentApplication()]?.application;
    if (Application) return <Application></Application>
    else return undefined;
  }
  return <div class="application-container">
    {getApplicationElement()}
    <div class="adroid-bottom-op-bar">
      <div onClick={() => backToPrevLayer()}>
        <i class="material-icons">keyboard_arrow_left</i>
      </div>
      <div onClick={() => backToPrevLayer()}>
        <i class="material-icons">home</i>
      </div>
      <div>
        <i class="material-icons">tab</i>
      </div>
    </div>
  </div>
}