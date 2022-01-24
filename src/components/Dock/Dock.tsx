import { FullscreenApplication, ReadmeApplication } from '../Application';

import { Entry } from '../Entry';
import { EntryTypes } from '../../utils/constants';
import { For } from 'solid-js';
import { QRCodeApplication } from '../Application/QRCodeScanner/index';
import { SettingsApplication } from '../Application/Settings/index';

const apps = [
  FullscreenApplication.id,
  ReadmeApplication.id,
  QRCodeApplication.id,
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