import { Icon, appid } from "./Icon";

import { ApplicationConfig } from '../interfaces';
import { SettingsApp } from './Application';

export const SettingsApplication: ApplicationConfig = {
  id: appid,
  name: "Settings",
  description: "mBookmark Settings",
  icon: Icon,
  application: SettingsApp
}

