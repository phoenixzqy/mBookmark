import { BarcodeApplication } from './BarcodeScanner/index';
import { FullscreenApplication } from './Fullscreen/index';
import { ReadmeApplication } from './ReadMe/index';
import { SettingsApplication } from './Settings/index';

export { BarcodeApplication } from './BarcodeScanner/index';
export { FullscreenApplication } from './Fullscreen/index';
export { ReadmeApplication } from './ReadMe/index';
export { SettingsApplication } from './Settings/index';


export const ApplicationMapper = {
  [FullscreenApplication.id]: FullscreenApplication,
  [BarcodeApplication.id]: BarcodeApplication,
  [ReadmeApplication.id]: ReadmeApplication,
  [SettingsApplication.id]: SettingsApplication
}