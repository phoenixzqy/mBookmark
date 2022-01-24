import { Icon, appid } from "./Icon";

import { ApplicationConfig } from '../interfaces';
import { PokeclickerApp } from './Application';

export const PokeclickerApplication: ApplicationConfig = {
  id: appid,
  name: "Poke Clicker",
  description: "pokeclicker game",
  icon: Icon,
  application: PokeclickerApp
}

