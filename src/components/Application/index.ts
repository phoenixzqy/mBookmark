import { FullscreenApplication } from './Fullscreen/index';
import { PokeclickerApplication } from './Pokeclicker/index';
import { QRCodeApplication } from './QRCodeScanner/index';
import { ReadmeApplication } from './ReadMe/index';
import { SettingsApplication } from './Settings/index';

export { QRCodeApplication } from './QRCodeScanner/index';
export { FullscreenApplication } from './Fullscreen/index';
export { ReadmeApplication } from './ReadMe/index';
export { SettingsApplication } from './Settings/index';


export const ApplicationMapper = {
  [FullscreenApplication.id]: FullscreenApplication,
  [QRCodeApplication.id]: QRCodeApplication,
  [ReadmeApplication.id]: ReadmeApplication,
  [SettingsApplication.id]: SettingsApplication,
  [PokeclickerApplication.id]: PokeclickerApplication
}