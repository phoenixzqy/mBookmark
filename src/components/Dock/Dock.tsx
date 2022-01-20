import { FullscreenApplication, ReadmeApplication } from '../Application';

import { BarcodeApplication } from '../Application/BarcodeScanner/index';
import { Entry } from '../Entry';
import { EntryTypes } from '../../utils/constants';
import { For } from 'solid-js';
import { SettingsApplication } from '../Application/Settings/index';

const apps = [
  FullscreenApplication.id,
  ReadmeApplication.id,
  BarcodeApplication.id,
  SettingsApplication.id
]

export function Dock(props) {
  const { style = {} } = props;
  const myProps = { style };
  return (
    <div class="dock-container" {...myProps}>
      <div class="dock-background"></div>
      <For each={apps} children={<></>}>
        {appId => <Entry config={{ id: appId, type: EntryTypes.application }}></Entry>}
      </For>
    </div>
  );
}